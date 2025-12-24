from fastapi import APIRouter
from api.endpoints import product, forecasting, chat, data_connect

api_router = APIRouter()
api_router.include_router(product.router, prefix="/product", tags=["Products"])
api_router.include_router(forecasting.router, prefix="/forecast", tags=["Forecasting"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat Model"])
api_router.include_router(data_connect.router, prefix="/data_connect", tags=["Data Connect"])
