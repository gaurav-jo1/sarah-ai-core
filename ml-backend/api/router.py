from fastapi import APIRouter
from .endpoints import product, forecasting

api_router = APIRouter()
api_router.include_router(product.router, prefix="/product", tags=["Products"])
api_router.include_router(forecasting.router, prefix="/forecast", tags=["Forecasting"])
