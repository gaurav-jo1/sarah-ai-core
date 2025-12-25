from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from crud.inventory import get_latest_products

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_inventory(db: Session = Depends(get_db)):
    latest = get_latest_products(db)

    return latest