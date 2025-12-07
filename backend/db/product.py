from sqlalchemy import Column, Integer, String, Float
from db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    Product_ID = Column(String)
    Product_Name = Column(String)
    Category = Column(String)
    Month = Column(String)
    Month_Number = Column(Integer)
    Year_Number = Column(Integer)
    Current_Price = Column(Float)
    Opening_Price = Column(Float)
    Cost_Per_Unit = Column(Float)
    Price_Change_Percent = Column(Float)
    Units_Sold = Column(Integer)
    Revenue = Column(Float)
    Opening_Stock = Column(Integer)
    Stock_Received = Column(Integer)
    Stock_On_Hand = Column(Integer)
