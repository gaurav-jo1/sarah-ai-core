from pydantic import BaseModel, Field
from uuid import UUID

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

    # @computed_field
    # @property
    # def year_number(self) -> int:
    #     return int(self.period.split("-")[0])

    # @computed_field
    # @property
    # def month_number(self) -> int:
    #     return int(self.period.split("-")[1])

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class ProductResponse(BaseModel):
    id: UUID
    Product_ID: str
    Product_Name: str
    Category: str
    Period: str = Field(..., description="Format: YYYY-MM, e.g., 2021-01")
    Current_Price: float
    Opening_Price: float
    Cost_Per_Unit: float
    Units_Sold: int
    Opening_Stock: int
    Stock_Received: int

    # @computed_field
    # @property
    # def Year_Number(self) -> int:
    #     return int(self.Period.split("-")[0])

    # @computed_field
    # @property
    # def Month_Number(self) -> int:
    #     return int(self.Period.split("-")[1])

    # @computed_field
    # @property
    # def Month(self) -> str:
    #     return datetime.strptime(self.Period, "%Y-%m").strftime("%B")