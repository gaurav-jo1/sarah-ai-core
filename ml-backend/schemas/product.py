from pydantic import BaseModel, Field, computed_field
from typing import Dict
from uuid import UUID
from datetime import datetime

class ProductData(BaseModel):
    product_id: str = Field(alias="Product_ID")
    product_name: str = Field(alias="Product_Name")
    category: str = Field(alias="Category")
    period: str = Field(alias="Period")  # e.g. "2021-01"
    current_price: float = Field(alias="Current_Price")
    opening_price: float = Field(alias="Opening_Price")
    cost_per_unit: float = Field(alias="Cost_Per_Unit")
    units_sold: int = Field(alias="Units_Sold")
    opening_stock: int = Field(alias="Opening_Stock")
    stock_received: int = Field(alias="Stock_Received")
    revenue: float = Field(alias="Revenue")
    stock_on_hand: int = Field(alias="Stock_On_Hand")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class ProductDataResponse(ProductData):
    id: UUID

    @computed_field
    @property
    def Year_Number(self) -> int:
        return int(self.period.split("-")[0])

    @computed_field
    @property
    def Month_Number(self) -> int:
        return int(self.period.split("-")[1])

    @computed_field
    @property
    def Month(self) -> str:
        return datetime.strptime(self.period, "%Y-%m").strftime("%B")

class MetricsResponse(BaseModel):
    monthly_revenue: Dict[str, float]
    units_sold: Dict[str, int]
    stock_on_hand: Dict[str, int]
    top_products :Dict[str, int]
    latest_monthly_revenue: float
    latest_units_sold: int
    latest_stock_on_hand: int
    latest_top_products: int
