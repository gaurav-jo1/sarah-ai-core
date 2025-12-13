import pandas as pd
from sqlalchemy.orm import Session
from db.database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException, status
from db.product import Product
from typing import Optional
import httpx

router = APIRouter()

ML_SERVICE_URL = "http://ml-service:8001"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", status_code=status.HTTP_200_OK)
async def get_forecast(product_id: Optional[str] = None, db: Session = Depends(get_db)):
    try:
        if not product_id:
            products_list = db.query(Product).first()

            print(f"Product list: {products_list}")
            product_id = products_list.Product_ID

        products_list = (
            db.query(Product)
            .filter(Product.Product_ID == product_id)
            .order_by(Product.Period.asc())
            .all()
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

                return response.json()

            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"Prediction service error: {str(e)}",
                )
            except httpx.RequestError as e:
                raise HTTPException(
                    status_code=503, detail=f"Prediction service unavailable: {str(e)}"
                )

    except HTTPException:
        # Re-raise FastAPI exceptions
        raise
    except Exception as _:
        # Log in production: import logging; logging.error(f"Metrics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch metrics",
        )
