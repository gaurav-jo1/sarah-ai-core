from db.product import Product
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from pandas import DataFrame
from db.database import SessionLocal
from typing import Optional
from contextlib import contextmanager


@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_latest_products(db: Optional[Session] = None):
    if db is None:
        with get_db() as new_db:
            return get_latest_products(db=new_db)

    latest_period = db.scalar(select(func.max(Product.Period)))
    if not latest_period:
        return []

    return db.scalars(select(Product).where(Product.Period == latest_period)).all()


def get_inventory_list(current_inventory):
    return [
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


def get_product_data_as_df(db: Optional[Session] = None) -> DataFrame:
    if db is None:
        with get_db() as new_db:
            return get_product_data_as_df(db=new_db)

    all_data = db.query(Product).all()

    return DataFrame(
        [
            {
                "product_id": row.Product_ID,
                "period": row.Period,
                "units_sold": row.Units_Sold,
            }
            for row in all_data
        ]
    )
