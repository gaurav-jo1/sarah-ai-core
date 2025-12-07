from sqlalchemy.orm import Session
from ..db import product
from ..db import UserCreate

def create_user(db: Session, data: UserCreate):
    user = product.User(**data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session):
    return db.query(product.User).all()
