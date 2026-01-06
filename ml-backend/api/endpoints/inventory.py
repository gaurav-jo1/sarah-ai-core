from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import SessionLocal
from crud.inventory import (
    get_latest_products,
    get_product_data_as_df,
    get_inventory_list,
)
from ml.demand_forecasting import ChronosForecaster
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

    inventory = get_inventory_list(current_inventory)

    df = get_product_data_as_df(db)

    try:
        forecast = await ChronosForecaster().predict_units_raw(
            df=df, prediction_length=3
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")

    total_forecast = defaultdict(float)

    for data in forecast:
        total_forecast[data["product_id"]] += data["predictions"]

        new_1 = f"{data['product_id']}_0_1"
        new_9 = f"{data['product_id']}_0_9"

        total_forecast[new_1] += data["0.1"]
        total_forecast[new_9] += data["0.9"]

    for data in inventory:
        data["prediction_3m"] = total_forecast[data["product_id"]]

        new_1 = f"{data['product_id']}_0_1"
        new_9 = f"{data['product_id']}_0_9"

        data["prediction_3m_lower_bound"] = total_forecast[new_1]
        data["prediction_3m_upper_bound"] = total_forecast[new_9]

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
        data["total_projected_profit_3m_lower_bound"] = (
            data["margin_per_unit"] * data["prediction_3m_lower_bound"]
        )
        data["total_projected_profit_3m_upper_bound"] = (
            data["margin_per_unit"] * data["prediction_3m_upper_bound"]
        )


        data["total_projected_revenue_3m"] = (
            data["current_price"] * data["prediction_3m"]
        )
        data["total_projected_revenue_3m_lower_bound"] = (
            data["current_price"] * data["prediction_3m_lower_bound"]
        )
        data["total_projected_revenue_3m_upper_bound"] = (
            data["current_price"] * data["prediction_3m_upper_bound"]
        )
        data["replenishment_needed"] = data["prediction_3m"] - data["stock_on_hand"]

    try:
        summary = InventoryModel().inventory_insight(inventory=inventory)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating response: {str(e)}"
        )

    return {"inventory": inventory, "summary": summary}
