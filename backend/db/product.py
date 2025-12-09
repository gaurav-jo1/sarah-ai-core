import uuid
from db.database import Base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import Column, Integer, String, Float, Index, UniqueConstraint

class Product(Base):
    __tablename__ = "products"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    Product_ID = Column(String, nullable=False)
    Product_Name = Column(String, nullable=False)
    Category = Column(String, nullable=False)
    Period = Column(String, nullable=False)        # e.g., "2021-01"
    Current_Price = Column(Float, nullable=False)
    Opening_Price = Column(Float, nullable=False)
    Cost_Per_Unit = Column(Float, nullable=False)
    Units_Sold = Column(Integer, nullable=False)
    Opening_Stock = Column(Integer, nullable=False)
    Stock_Received = Column(Integer, nullable=False)

    # Optional: Add index on Period or (Product_ID, Period) for faster queries
    __table_args__ = (
        UniqueConstraint('Product_ID', 'Period', name='uix_product_period'),
        Index('ix_product_period', 'Product_ID', 'Period'),
    )