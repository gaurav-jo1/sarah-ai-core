import os
import pandas as pd
from db.product import Product
from sqlalchemy.orm import Session
from db.database import SessionLocal
from schemas.product import ProductData, MetricsResponse
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from collections import defaultdict

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


@router.get(
    "/metrics",
    response_model=MetricsResponse,
    status_code=status.HTTP_200_OK,
)
def get_metrics(db: Session = Depends(get_db)):
    try:
        last_4_periods = (
            db.query(Product.Period)
            .distinct()
            .order_by(Product.Period.desc())
            .limit(6)
            .all()
        )
        if not last_4_periods:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No periods found in the database",
            )
        last_4_periods = [p[0] for p in last_4_periods]

        products = (
            db.query(Product)
            .filter(Product.Period.in_(last_4_periods))
            .order_by(Product.Period.desc())
            .all()
        )
        if not products:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No products found for recent periods",
            )

        grouped = defaultdict(list)
        for p in products:
            grouped[p.Period].append(p)

        total_revenue = {}
        total_units_sold = {}
        total_stock_on_hand = {}
        all_top_products = {}  # Overall top products across all periods

        for period, group_products in grouped.items():
            period = pd.to_datetime(period, format="%Y-%m").strftime("%b-%Y")

            total_revenue[period] = round(
                sum(p.Current_Price * p.Units_Sold for p in group_products), 2
            )

            total_units_sold[period] = sum(p.Units_Sold for p in group_products)

            total_stock_on_hand[period] = sum(
                (p.Opening_Stock + p.Stock_Received - p.Units_Sold)
                for p in group_products
            )

            for p in group_products:
                if p.Product_Name not in all_top_products:
                    all_top_products[p.Product_Name] = p.Units_Sold
                else:
                    all_top_products[p.Product_Name] += p.Units_Sold

        top_4 = sorted(all_top_products.items(), key=lambda x: x[1], reverse=True)[:4]

        top_products_dict = dict(top_4)

        latest_period = pd.to_datetime(last_4_periods[0], format="%Y-%m").strftime(
            "%b-%Y"
        )

        response_data = {
            "monthly_revenue": total_revenue,
            "units_sold": total_units_sold,
            "stock_on_hand": total_stock_on_hand,
            "top_products": top_products_dict,
            "latest_monthly_revenue": total_revenue[latest_period],
            "latest_units_sold": total_units_sold[latest_period],
            "latest_stock_on_hand": total_stock_on_hand[latest_period],
            "latest_top_products": len(top_4),
        }

        return MetricsResponse(**response_data)

    except HTTPException:
        raise
    except Exception as _:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch metrics",
        )


@router.post("/data_connect", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    filename = file.filename
    extension = os.path.splitext(filename)[1].lower()

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
                Revenue=p.revenue,
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
