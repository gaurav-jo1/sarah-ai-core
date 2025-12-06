from sqlalchemy.orm import Session
from ..db import models
from ..db import UserCreate

def create_user(db: Session, data: UserCreate):
    user = models.User(**data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session):
    return db.query(models.User).all()
