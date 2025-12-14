import pandas as pd
from sqlalchemy.orm import Session
from db.database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException, status
from db.product import Product
from typing import Optional
import httpx
from sqlalchemy import func

router = APIRouter()

ML_SERVICE_URL = "http://ml-service:8001"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", status_code=status.HTTP_200_OK)
async def get_forecasting(
    product_id: Optional[str] = None, db: Session = Depends(get_db)
):
    try:
        # Get product names
        products_name = (
            db.query(Product.Product_ID, Product.Product_Name)
            .distinct()
            .order_by(Product.Product_Name)
            .all()
        )
        product_dict = {
            product.Product_ID: product.Product_Name for product in products_name
        }
        product_dict["All"] = "All Products"  # Add for aggregated view

        if not product_id:
            monthly_sales = (
                db.query(
                    Product.Period.label("id"),
                    func.sum(Product.Units_Sold).label("total_units_sold"),
                    Product.Period,
                )
                .group_by(Product.Period)
                .order_by(Product.Period)
                .all()
            )

            df = pd.DataFrame(
                [
                    {
                        "product_id": "All",
                        "period": row.Period,
                        "units_sold": row.total_units_sold,
                    }
                    for row in monthly_sales
                ]
            )

        else:
            products_list = (
                db.query(Product)
                .filter(Product.Product_ID == product_id)
                .order_by(Product.Period.asc())
                .all()
            )

            if not products_list:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product with ID '{product_id}' not found"
                )

            df = pd.DataFrame(
                [
                    {
                        "product_id": p.Product_ID,
                        "period": p.Period,
                        "units_sold": p.Units_Sold,
                    }
                    for p in products_list
                ]
            )

        # Check if dataframe is empty
        if df.empty:
            raise HTTPException(
                status_code=404,
                detail="No data found"
            )

        # Format response data
        response_df = df.copy()
        response_df['period'] = pd.to_datetime(response_df['period']).dt.strftime('%b %Y')
        response_df = response_df.to_dict(orient="records")

        # Keep original for ML service
        df_dict = df.to_dict(orient="records")

        request_payload = {"df": df_dict, "prediction_length": 2}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{ML_SERVICE_URL}/predict",
                    json=request_payload,
                    timeout=30.0,
                )
                response.raise_for_status()

                return {
                    "products_name": product_dict,
                    "data": response_df[-4:],
                    "prediction": response.json(),
                }

            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"Prediction service error: {str(e)}",
                )
            except httpx.RequestError as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"Prediction service unavailable: {str(e)}",
                )

    except HTTPException:
        raise
    except Exception as _:
        # Consider logging the actual error: logging.error(f"Forecasting error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch forecast data",
        )