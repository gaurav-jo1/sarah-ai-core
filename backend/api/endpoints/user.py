# app/api/endpoints/user.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...db import SessionLocal
from ...db import user
from ...db import UserCreate, UserResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UserResponse)
def create_user_api(data: UserCreate, db: Session = Depends(get_db)):
    return user.create_user(db, data)

@router.get("/", response_model=list[UserResponse])
def get_users_api(db: Session = Depends(get_db)):
    return user.get_users(db)
