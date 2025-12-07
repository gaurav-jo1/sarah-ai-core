from pydantic import BaseModel, Field
from typing import List

class ProductData(BaseModel):
    product_id: str = Field(alias="Product_ID")
    product_name: str = Field(alias="Product_Name")
    category: str = Field(alias="Category")
    month: str = Field(alias="Month")
    month_number: int = Field(alias="Month_Number")
    year_number: int = Field(alias="Year_Number")
    current_price: float = Field(alias="Current_Price")
    opening_price: float = Field(alias="Opening_Price")
    cost_per_unit: float = Field(alias="Cost_Per_Unit")
    price_change_percent: float = Field(alias="Price_Change_Percent")
    units_sold: int = Field(alias="Units_Sold")
    revenue: float = Field(alias="Revenue")
    opening_stock: int = Field(alias="Opening_Stock")
    stock_received: int = Field(alias="Stock_Received")
    stock_on_hand: int = Field(alias="Stock_On_Hand")

    model_config = {
        "populate_by_name": True,  # Allows using Pythonic names too
        "from_attributes": True,
    }

class ProductDataList(BaseModel):
    data: List[ProductData]
