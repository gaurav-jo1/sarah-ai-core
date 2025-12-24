import pandas as pd
from db.product import Product
from sqlalchemy.orm import Session
from db.database import SessionLocal
from schemas.product import  MetricsResponse
from fastapi import APIRouter, Depends, HTTPException, status
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


