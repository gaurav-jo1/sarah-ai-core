import pandas as pd
from sqlalchemy.orm import Session
from db.database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException, status
from db.product import Product
from typing import Optional
import httpx
from sqlalchemy import func
from ml.demand_forecasting import ChronosForecaster

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/units", status_code=status.HTTP_200_OK)
async def units_forecasting(
    product_id: Optional[str] = None, db: Session = Depends(get_db)
):
    try:
        products_name = (
            db.query(Product.Product_ID, Product.Product_Name)
            .distinct()
            .order_by(Product.Product_Name)
            .all()
        )
        product_dict = {
            product.Product_ID: product.Product_Name for product in products_name
        }
        product_dict["All"] = "All Products"

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
                    status_code=404, detail=f"Product with ID '{product_id}' not found"
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

        if df.empty:
            raise HTTPException(status_code=404, detail="No data found")

        response_df = df.copy()
        response_df["period"] = pd.to_datetime(response_df["period"]).dt.strftime(
            "%b %Y"
        )
        response_df = response_df.to_dict(orient="records")

        try:
            response = await ChronosForecaster().predict_units(df=df)

            return {
                "products_name": product_dict,
                "data": response_df[-6:],
                "prediction": response,
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch forecast data",
        )


@router.get("/revenue", status_code=status.HTTP_200_OK)
async def revenue_forecasting(
    product_id: Optional[str] = None, db: Session = Depends(get_db)
):
    try:
        products_name = (
            db.query(Product.Product_ID, Product.Product_Name)
            .distinct()
            .order_by(Product.Product_Name)
            .all()
        )
        product_dict = {
            product.Product_ID: product.Product_Name for product in products_name
        }
        product_dict["All"] = "All Products"

        if not product_id:
            monthly_data = (
                db.query(
                    Product.Period.label("id"),
                    func.sum(Product.Revenue).label("total_revenue"),
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
                        "revenue": round(row.total_revenue, 2),
                        "units_sold": row.total_units_sold,
                    }
                    for row in monthly_data
                ]
            )

        else:
            product_data = (
                db.query(
                    Product.Period.label("id"),
                    Product.Revenue,
                    Product.Units_Sold,
                    Product.Period,
                )
                .filter(Product.Product_ID == product_id)
                .order_by(Product.Period)
                .all()
            )

            if not product_data:
                raise HTTPException(
                    status_code=404, detail=f"Revenue with ID '{product_id}' not found"
                )

            df = pd.DataFrame(
                [
                    {
                        "product_id": product_id,
                        "period": row.Period,
                        "revenue": round(row.Revenue, 2),
                        "units_sold": row.Units_Sold,
                    }
                    for row in product_data
                ]
            )

        if df.empty:
            raise HTTPException(status_code=404, detail="No data found")

        response_df = df.copy()
        response_df["period"] = pd.to_datetime(response_df["period"]).dt.strftime(
            "%b %Y"
        )
        response_df = response_df.to_dict(orient="records")

        try:
            response = await ChronosForecaster().predict_revenue(df=df)

            return {
                "products_name": product_dict,
                "data": response_df[-6:],
                "prediction": response,
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch forecast data",
        )
