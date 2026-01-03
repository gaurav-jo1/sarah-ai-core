from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import SessionLocal
from crud.inventory import get_latest_products
from ml.demand_forecasting import ChronosForecaster
from db.product import Product
import pandas as pd
from collections import defaultdict
from datetime import datetime
from dateutil.relativedelta import relativedelta
from ml.inventory_model import InventoryModel

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def calculate_stockout_month(current_stock, forecasted_demand_3m, current_date=None):
    if current_date is None:
        current_date = datetime.now()

    monthly_demand = forecasted_demand_3m / 3

    if monthly_demand <= 0:
        return None

    months_until_stockout = current_stock / monthly_demand

    if months_until_stockout > 24:
        return None

    stockout_date = current_date + relativedelta(months=int(months_until_stockout))

    if current_stock % monthly_demand > 0:
        stockout_date = current_date + relativedelta(
            months=int(months_until_stockout) + 1
        )

    return stockout_date.strftime("%b %Y")


@router.get("/")
def get_inventory(db: Session = Depends(get_db)):
    latest = get_latest_products(db)

    return latest


@router.get("/insight")
async def get_ai_insights(db: Session = Depends(get_db)):
    current_inventory = get_latest_products(db)

    inventory = [
        {
            "product_id": row.Product_ID,
            "product_name": row.Product_Name,
            "period": row.Period,
            "opening_stock": row.Opening_Stock,
            "stock_received": row.Stock_Received,
            "units_sold": row.Units_Sold,
            "stock_on_hand": row.Stock_On_Hand,
            "current_price": row.Current_Price,
            "cost_per_unit": row.Cost_Per_Unit,
        }
        for row in current_inventory
    ]

    all_data = db.query(Product).all()

    df = pd.DataFrame(
        [
            {
                "product_id": row.Product_ID,
                "period": row.Period,
                "units_sold": row.Units_Sold,
            }
            for row in all_data
        ]
    )

    try:
        forecast = await ChronosForecaster().predict_units_raw(
            df=df, prediction_length=3
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")

    total_forecast = defaultdict(float)

    for data in forecast:
        total_forecast[data["product_id"]] += data["predictions"]

    for data in inventory:
        data["prediction_3m"] = total_forecast[data["product_id"]]

    for data in inventory:
        current_stock = data["stock_on_hand"]
        forecasted_demand = data["prediction_3m"]

        data["predicted_stockout_month"] = calculate_stockout_month(
            current_stock, forecasted_demand
        )

        data["margin_per_unit"] = data["current_price"] - data["cost_per_unit"]
        data["total_projected_profit_3m"] = (
            data["margin_per_unit"] * data["prediction_3m"]
        )
        data["total_projected_revenue_3m"] = (
            data["current_price"] * data["prediction_3m"]
        )
        data["replenishment_needed"] = data["prediction_3m"] - data["stock_on_hand"]

    try:
        summary = InventoryModel().inventory_insight(inventory=inventory)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating response: {str(e)}"
        )

    return {"inventory": inventory, "summary": summary}
