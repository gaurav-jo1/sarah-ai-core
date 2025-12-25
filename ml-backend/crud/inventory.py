from db.product import Product
from sqlalchemy import select, func
from sqlalchemy.orm import Session

def get_latest_products(session: Session):
    latest_period = session.scalar(select(func.max(Product.Period)))
    if not latest_period:
        return []

    return session.scalars(
        select(Product).where(Product.Period == latest_period)
    ).all()