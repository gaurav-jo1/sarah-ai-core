import os
import pandas as pd
from typing import List
from db.product import Product
from sqlalchemy.orm import Session
from db.database import SessionLocal
from fastapi.encoders import jsonable_encoder
from sqlalchemy.dialects.postgresql import insert
from schemas.product import ProductResponse, ProductData
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status

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
@router.get("/data", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    products_data = jsonable_encoder(products)
    print(f"Retrieved {len(products)} products from the database.")
    return products_data


@router.post("/data_connect", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    filename = file.filename
    extension = os.path.splitext(filename)[1].lower()

    # 1. Read file based on extension
    try:
        contents = await file.read()
        if extension == ".csv":
            df = pd.read_csv(pd.compat.StringIO(contents.decode("utf-8")))
        elif extension in [".xls", ".xlsx"]:
            df = pd.read_excel(contents)
        else:
            raise HTTPException(
                status_code=400, detail="Unsupported file type. Use CSV or Excel."
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if df.empty:
        return {
            "filename": filename,
            "message": "Empty file — nothing to process.",
            "processed_rows": 0,
        }

    # 2. Validate and parse all rows efficiently
    try:
        products_data = [
            ProductData.model_validate(row, from_attributes=True)
            for row in df.to_dict(orient="records")
        ]

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Data validation failed: {str(e)}")

    try:
        records_to_insert = [
            Product(
                Product_ID=p.product_id,
                Product_Name=p.product_name,
                Category=p.category,
                Period=p.period,
                Current_Price=p.current_price,
                Opening_Price=p.opening_price,
                Cost_Per_Unit=p.cost_per_unit,
                Units_Sold=p.units_sold,
                Opening_Stock=p.opening_stock,
                Stock_Received=p.stock_received,
            )
            for p in products_data
        ]

        db.bulk_save_objects(records_to_insert)

        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database insert failed: {str(e)}")

    return {
        "filename": filename,
        "message": "Data uploaded and saved successfully.",
        "processed_rows": len(products_data),
    }
