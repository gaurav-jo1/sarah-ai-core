from fastapi import APIRouter, Depends, HTTPException
from fastapi import status
from fastapi import UploadFile, File
import pandas as pd
import os
from sqlalchemy.orm import Session
from db.database import SessionLocal
from typing import List
from schemas.product import ProductData
from db.product import Product

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def home():
    return {"message": "Welcome to the FastAPI application!"}

# Get all product data
@router.get("/data", response_model=List[ProductData])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    print(f"Retrieved {len(products)} products from the database.")

    return products

@router.post("/data_connect", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided.")

    filename = file.filename
    extension = os.path.splitext(filename)[1].lower()

    try:
        if extension == ".csv":
            df = pd.read_csv(file.file)
        elif extension in [".xls", ".xlsx"]:
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type. Please upload a CSV or Excel file.")

        if df.empty:
            return {"filename": filename, "message": "Empty file uploaded—no data processed."}

        products: List[ProductData] = []
        for row in df.to_dict(orient="records"):
            # Use strict=False if you want to ignore extra/missing fields
            products.append(ProductData.model_validate(row))

        batch_size = 1000
        for i in range(0, len(products), batch_size):
            batch = products[i:i + batch_size]
            for product in batch:
                db_record = Product(**product.model_dump(by_alias=True))
                db.add(db_record)
            db.flush()
        db.commit()

    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty or unreadable.")
    except (pd.errors.ParserError, ValueError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid file format: {str(e)}")
    except Exception as e:  # Catch-all for DB/validation errors
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Processing failed: {str(e)}")

    return {"filename": filename, "message": "File received successfully.", "processed_rows": len(products)}
