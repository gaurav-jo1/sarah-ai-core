import base64
import json
import re
import os
import fitz
from typing import List, Dict, Any, Optional
from fastapi import UploadFile
from huggingface_hub import InferenceClient
from settings.settings import api_settings


async def process_uploaded_file(file: UploadFile) -> List[Dict[str, str]]:
    """
    Reads an uploaded file (PDF or Image) and converts it to a list of base64 encoded data URLs.
    """
    if not file.filename:
        raise ValueError("No file uploaded.")

    extension = os.path.splitext(file.filename)[1].lower()
    images_base64 = []

    try:
        if extension == ".pdf":
            pdf_bytes = await file.read()
            if not pdf_bytes:
                raise ValueError("PDF file is empty")

            pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            try:
                for page_index in range(len(pdf_doc)):
                    page = pdf_doc[page_index]
                    pix = page.get_pixmap()
                    image_bytes = pix.tobytes("png")
                    base64_image = base64.b64encode(image_bytes).decode("utf-8")

                    images_base64.append(
                        {
                            "page": page_index + 1,
                            "data_url": f"data:image/png;base64,{base64_image}",
                        }
                    )
            finally:
                pdf_doc.close()

        else:
            image_bytes = await file.read()
            if not image_bytes:
                raise ValueError("Image file is empty")

            base64_image = base64.b64encode(image_bytes).decode("utf-8")
            images_base64.append(
                {
                    "page": 1,
                    "data_url": f"data:{file.content_type};base64,{base64_image}",
                }
            )

    except Exception as e:
        raise RuntimeError(f"Failed to process file: {str(e)}")

    return images_base64


def extract_invoice_data(
    images_base64: List[Dict[str, str]],
) -> Optional[Dict[str, Any]]:
    """
    Sends the invoice images to the VLM (Qwen) to extract structured data.
    """
    instruction = """
        You are a high-precision OCR Transcriber. Your task is to map the visual and logical structure of ANY invoice into a machine-readable JSON format.

        ### EXTRACTION LOGIC:
        1. **Key Discovery**: Do not look for predefined fields. Instead, identify labels on the document and convert them into snake_case keys.
        - Example: If the document says "Customer ID:", create the key `customer_id`.
        - If it says "Billing Period:", create `billing_period`.
        2. **Structural Mapping**: Organize the data based on its physical location:
            - **Header/Top**: Static identification data.
            - **Parties**: Details for the 'From' and 'To' entities.
            - **Main Table**: All recurring line items (transcribe every row verbatim).
            - **Summary**: Totals, taxes, and final amounts.
            - **Footer**: Banking, legal notices, and payment instructions.
        3. **Verbatim Values**: Transcribe all values exactly as written (preserve currency symbols, date formats, and European decimal commas).

        ### KEY NAMING RULES:
        - Use **snake_case** only.
        - Remove special characters (#, :, €, etc.) from keys.
        - If a label is missing but a value is clear (like a lone IBAN), use a logical generic key.

        ### OUTPUT STRUCTURE:
        Return a strict JSON object with these generic top-level containers:
        1. "document_metadata": Unique identifiers and dates found in the header.
        2. "issuer_details": All information regarding the sender.
        3. "recipient_details": All information regarding the bill-to party.
        4. "table_data": An array of objects where each object represents a row. Use the table's own column headers as keys.
        5. "monetary_summary": A mapping of all totals and tax breakdowns.
        6. "supplementary_data": Bank details, terms, and footer text.

        Output ONLY valid JSON.
    """

    content = [{"type": "text", "text": instruction}]

    for data_url in images_base64:
        content.append(
            {"type": "image_url", "image_url": {"url": data_url["data_url"]}}
        )

    client = InferenceClient(api_key=api_settings.HUGGING_FACE_KEY)

    completion_qwen = client.chat.completions.create(
        model="Qwen/Qwen3-VL-30B-A3B-Instruct",
        messages=[
            {
                "role": "system",
                "content": "You are a specialized OCR system. You extract all text without filtering. You only output valid JSON.",
            },
            {
                "role": "user",
                "content": content,
            },
        ],
        temperature=0.1,
    )

    response_qwen = completion_qwen.choices[0].message.content
    match = re.search(r"\{.*\}", response_qwen, re.DOTALL)

    if match:
        clean_json = match.group(0)
        try:
            return json.loads(clean_json)
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON: {e}")
            return None
    else:
        print("No JSON object found in response")
        return None


def reconcile_invoice_po(
    invoice_data: Dict[str, Any], po_items: List[Dict[str, Any]]
) -> Any:
    """
    Reconciles the invoice data with the Purchase Order items using an LLM.
    """
    user_prompt = f"""
        Input Data:
        Invoice data: {invoice_data},
        Purchase Order data: {po_items}

        Task 1: Issuer Extraction
        Extract the following details about the entity that issued the invoice:
        - name, address, phone, email, website.
        If a field is missing, return an empty string "".

        Task 2: Line Item Matching
        Compare the `line_items` from the PO against the `table_data` from the Invoice. Find the matching invoice entry for every item listed in the PO.

        Matching Rules:
        1. Semantic Matching: Match items by description despite phrasing variations (e.g., "Basic Fee wmView" vs "Basic Fee").
        2. Ignore Zero-Value Noise: Prioritize invoice items with non-zero quantities.
        3. Data Cleaning: Remove currency symbols and convert European number formats (e.g., 1.000,00) to standard decimals (1000.00).

        Output Format:
        Return ONLY a valid JSON object. Do not include conversational text. The structure must be:
        {{
        "issuer_details": {{
            "name": string,
            "address": string,
            "phone": string,
            "email": string,
            "website": string
        }},
        "line_item_matches": [
            {{
            "product_or_description": string,
            "po_quantity": number,
            "po_price": number,
            "invoice_quantity": number,
            "invoice_price": number
            }}
        ]
        }}
    """

    client = InferenceClient(api_key=api_settings.HUGGING_FACE_KEY)

    completion_invoice_po = client.chat.completions.create(
        model="zai-org/GLM-4.7",
        messages=[
            {
                "role": "system",
                "content": "You are a data reconciliation expert specializing in accounts payable.",
            },
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.1,
    )

    response_invoice_po = completion_invoice_po.choices[0].message.content

    match_invoice_ro = re.search(
        r"```json\s*(.*?)\s*```", response_invoice_po, re.DOTALL
    )

    if match_invoice_ro:
        json_str_invoice_po = match_invoice_ro.group(1)
    else:
        json_str_invoice_po = response_invoice_po.strip()

    return json.loads(json_str_invoice_po)


def extract_invoice_summary(invoice_data: Dict[str, Any]) -> Any:
    """
    Extracts and standardizes the monetary summary from the invoice data.
    """
    invoice_summary_prompt = f"""
        Input Data:
        Invoice Data:
        {invoice_data}

        Task:
        - Extract all numeric values from the monetary summary.
        - Remove currency symbols, commas, and any special characters.
        - Convert all values to valid numbers (int or float).
        - If a value is missing or invalid, return null.

        Output:
        Return ONLY valid JSON. Do not include any explanation or extra text.
    """

    client = InferenceClient(api_key=api_settings.HUGGING_FACE_KEY)

    completion_summary = client.chat.completions.create(
        model="zai-org/GLM-4.7",
        messages=[
            {
                "role": "system",
                "content": "You are a data reconciliation expert specializing in accounts payable.",
            },
            {"role": "user", "content": invoice_summary_prompt},
        ],
        temperature=0.1,
    )

    response_summary = completion_summary.choices[0].message.content

    match_summary = re.search(r"```json\s*(.*?)\s*```", response_summary, re.DOTALL)

    if match_summary:
        json_str_summary = match_summary.group(1)
    else:
        json_str_summary = response_summary.strip()

    return json.loads(json_str_summary)
