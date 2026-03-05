from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
import database.crud as crud, schemas.schemas as schemas, services.analytics as analytics
from auth.auth import create_access_token, verify_password
from datetime import timedelta
from auth.auth import decode_access_token
from fastapi import Header

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = parts[1]
    payload = decode_access_token(token)
    email = payload.get('sub')
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/transactions", response_model=schemas.TransactionResponse)
def create_transactions(transaction: schemas.TransactionCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    tx_data = transaction.model_dump()
    tx_data['user_id'] = current_user.id
    tx_with_user = schemas.TransactionCreate(**tx_data)
    return crud.create_transaction(db, tx_with_user)

@router.get("/transactions")
def list_transactions(db: Session = Depends(get_db)):
    return crud.get_transactions(db)

@router.get("/analytics/category-breakdown")
def category_breakdown(db: Session = Depends(get_db)):
    return analytics.category_breakdown(db)


@router.put("/transactions/{transaction_id}", response_model=schemas.TransactionResponse)
def update_transaction(transaction_id: int, transaction: schemas.TransactionUpdate, db: Session = Depends(get_db)):
    updated = crud.update_transaction(db, transaction_id, transaction)
    if updated is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated


@router.post('/login', response_model=schemas.Token)
def login_for_access_token(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post('/register', response_model=schemas.Token)
def register_user(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, form_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = crud.create_user(db, form_data)

    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = parts[1]
    payload = decode_access_token(token)
    email = payload.get('sub')
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get('/me')
def get_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "surname": current_user.surname,
        "occupation": current_user.occupation,
        "monthly_income": current_user.monthly_income,
    }

@router.get("/analytics/kpis")
def kpis(user_id: int, db: Session = Depends(get_db)):
    k = crud.get_user_kpis(db, user_id)
    if k is None:
        raise HTTPException(status_code=404, detail="User not found")
    return k
