# backend/crud.py
from sqlalchemy.orm import Session
from database import models

def get_user(db: Session, user_id: str = "113423075"):
    return db.query(models.User).filter(models.User.studentId == user_id).first()