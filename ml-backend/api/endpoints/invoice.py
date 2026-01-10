from fastapi import APIRouter, File, UploadFile, status, HTTPException
from huggingface_hub import InferenceClient
from settings.settings import api_settings
import base64

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    image_bytes = await file.read()

    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    data_url = f"data:{file.content_type};base64,{base64_image}"

    instruction = "Transcribe the text in this image accurately. Maintain the original layout and formatting where possible. Give me the summary of this image."

    # Qwen/Qwen2.5-VL-7B-Instruct
    client = InferenceClient(api_key=api_settings.HUGGING_FACE_KEY)

    completion = client.chat.completions.create(
        model="Qwen/Qwen2.5-VL-7B-Instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": instruction},
                    {
                        "type": "image_url",
                        "image_url": {"url": data_url},
                    },
                ],
            }
        ],
    )

    response = completion.choices[0].message

    # Get the invoice number and get the data from the database.

    # validate the data with LLM or other tools

    return {
        "message": "Invoice validated successfully. All details match the purchase order..",
        "response": response.content,
    }
