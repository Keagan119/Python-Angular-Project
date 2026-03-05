from sqlalchemy.orm import Session
import models.models as models, schemas.schemas as schemas
from sqlalchemy import func
from auth.auth import get_password_hash

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    data = transaction.model_dump()
   
    db_transaction = models.Transaction(**data)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions(db: Session):
    return db.query(models.Transaction).all()


def update_transaction(db: Session, transaction_id: int, transaction: schemas.TransactionUpdate):
    db_tx = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_tx:
        return None

    if transaction.amount is not None:
        db_tx.amount = transaction.amount
    if transaction.category is not None:
        db_tx.category = transaction.category
    if transaction.description is not None:
        db_tx.description = transaction.description

    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx



def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed,
        name=getattr(user, 'name', None),
        surname=getattr(user, 'surname', None),
        occupation=getattr(user, 'occupation', None),
        monthly_income=getattr(user, 'monthly_income', None),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_kpis(db: Session, user_id: int):
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None

    total_income = user.monthly_income or 0.0

    
    res = db.query(
        func.coalesce(func.sum(models.Transaction.amount), 0.0).label("total_expenses"),
        func.count(models.Transaction.id).label("tx_count"),
        func.coalesce(func.avg(models.Transaction.amount), 0.0).label("avg_tx"),
    ).filter(models.Transaction.user_id == user_id).one()

    total_expenses = float(res.total_expenses)
    tx_count = int(res.tx_count)
    avg_tx = float(res.avg_tx) if tx_count > 0 else 0.0

    net_balance = total_income - total_expenses

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_balance": net_balance,
        "avg_transaction": avg_tx,
        "transaction_count": tx_count,
    }
