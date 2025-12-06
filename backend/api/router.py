from fastapi import APIRouter
from .endpoints import product_data

api_router = APIRouter()
api_router.include_router(product_data.router, prefix="/product_data", tags=["Products Data"])