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
from ml.chat_model import ChatModel

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
        # summary = ChatModel().inventory_insight(inventory=inventory)

        summary = """### Stockout Risk Timeline

            Toothpaste, Shampoo, Cereal, and Chips are projected to encounter stockouts by **February 2026**. Inventory for Chocolate and Soda is expected to be fully depleted by **March 2026**.

            ### Financial Projections (**January 2026** – **March 2026**)

            If you maintain stock to meet the full forecasted demand, your business could achieve the following:

            * Total Projected Revenue: **$23,563.63**
            * Total Projected Profit: **$11,181.49**
            * Top Profit Contributor: Shampoo is your most valuable item, projected to generate **$4,468.54** in profit over the next **3** months.

            ### Required Replenishment

            To avoid stockouts and capture the full revenue potential, you need to order at least the following quantities immediately:

            * Chocolate: **149.0** units
            * Toothpaste: **330.0** units
            * Shampoo: **314.0** units
            * Cereal: **90.0** units
            * Soda: **89.0** units
            * Chips: **193.0** units"""

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating response: {str(e)}"
        )

    return {"inventory": inventory, "summary": summary}
