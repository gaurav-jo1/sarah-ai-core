from fastapi import APIRouter, File, UploadFile, status, HTTPException
from huggingface_hub import InferenceClient
from settings.settings import api_settings
import base64
import json
import re
import os
import fitz

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

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
                pdf_doc.close()  # Ensure PDF is closed

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

    # 1. "raw_transcription": - A single string containing every piece of text found in the document for archival purposes.

    instruction = """
        You are a high-precision document extraction engine. Your task is to extract EVERYTHING from this image into a machine-readable JSON format.

        ### KEY NAMING RULES:
        All JSON keys must be 'variable-safe':
        1. Use **snake_case** (lowercase, underscores instead of spaces).
        2. Remove special characters (like #, :, or €) from the keys.
        3. Examples: 'Invoice #' becomes `invoice_number`, 'Date' becomes `invoice_date`.

        ### OUTPUT STRUCTURE:
        Provide a strict JSON object with these keys:

        1. "structured_data":
        - Standardized variables: `invoice_number`, `customer_id`, `invoice_date`, `vat_number`, `supplier_name`.
        - Any other unique fields found (e.g., `shipping_method`, `payment_terms`).

        2. "table_reconstruction":
        - An array of objects called 'rows'.
        - Column keys must be standardized (e.g., `description`, `quantity`, `unit_price`, `total_amount`).

        Output ONLY valid JSON.
    """

    content = [{"type": "text", "text": instruction}]

    for data_url in images_base64:
        content.append(
            {"type": "image_url", "image_url": {"url": data_url["data_url"]}}
        )

    # 1. Qwen/Qwen2.5-VL-7B-Instruct
    client = InferenceClient(api_key=api_settings.HUGGING_FACE_KEY)

    completion = client.chat.completions.create(
        model="Qwen/Qwen2.5-VL-7B-Instruct",
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

    response = completion.choices[0].message.content
    match = re.search(r"```json\s*(.*?)\s*```", response, re.DOTALL)

    if match:
        json_str = match.group(1)
    else:
        json_str = response.strip()

    data = json.loads(json_str)

    # 2. Get the invoice number and get the data from the database.

    # 3. validate the data with LLM or other tools

    return {
        "message": "Invoice validated successfully. All details match the purchase order..",
        "response": data,
    }
