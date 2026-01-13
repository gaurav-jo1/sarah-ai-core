from fastapi import APIRouter, File, UploadFile, status, HTTPException
import json
import os
from ml.invoice_handler import (
    process_uploaded_file,
    extract_invoice_data,
    reconcile_invoice_po,
    extract_invoice_summary,
)

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    try:
        # 1. Process the uploaded file into base64 images
        images_base64 = await process_uploaded_file(file)

        # 2. Extract structured data from the invoice using VLM
        invoice_data = extract_invoice_data(images_base64)

        if not invoice_data:
            raise HTTPException(
                status_code=422, detail="Failed to extract data from invoice."
            )

        # 3. Retrieve the purchase order data (Mock DB)
        # For actual implementation, this would query the database based on extracted PO number
        db_path = os.path.join("db", "po_mock.json")

        if not os.path.exists(db_path):
            raise FileNotFoundError(f"Mock database file not found at {db_path}")

        with open(db_path, "r") as f:
            po_data = json.load(f)
            po_items = po_data.get("line_items", [])
            po_summary = po_data.get("totals", {})

        # 4. Reconcile Invoice against PO
        data_invoice_po = reconcile_invoice_po(invoice_data, po_items)

        # 5. Extract and standardize invoice summary
        data_summary = extract_invoice_summary(invoice_data)

        return {
            "response": data_invoice_po,
            "invoice_summary": data_summary,
            "po_summary": po_summary,
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except RuntimeError as re:
        raise HTTPException(status_code=500, detail=str(re))
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred during processing."
        )
