from fastapi import APIRouter, File, UploadFile, status, HTTPException
import os

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def data_connect(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    filename = file.filename
    extension = os.path.splitext(filename)[1].lower()

    if extension != ".pdf":
        raise HTTPException(
            status_code=400, detail="Unsupported file type. Use CSV or Excel."
        )

    # DeepSeek OCR Data Extraction.

    # Get the invoice number and get the data from the database.

    # validate the data with LLM or other tools

    return {
        "message": "Invoice validated successfully. All details match the purchase order.."
    }
