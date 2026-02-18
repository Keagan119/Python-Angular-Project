from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import SessionLocal
import database.crud as crud, schemas.schemas as schemas, services.analytics as analytics

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/expenses", response_model=schemas.ExpenseResponse)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, expense)

@router.get("/expenses")
def list_expenses(db: Session = Depends(get_db)):
    return crud.get_expenses(db)

@router.get("/analytics/category-breakdown")
def category_breakdown(db: Session = Depends(get_db)):
    return analytics.category_breakdown(db)
