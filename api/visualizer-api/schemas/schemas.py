from pydantic import BaseModel
from datetime import date
from typing import Optional
from pydantic import validator


class TransactionCreate(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: date
    user_id: Optional[int] = None


class TransactionResponse(TransactionCreate):
    id: int

    class Config:
        from_attributes = True


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None

class UserCreate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: str
    password: str
    confirm_password: str
    occupation: Optional[str] = None
    monthly_income: Optional[float] = None

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        pw = values.get('password')
        if pw is not None and v != pw:
            raise ValueError('passwords do not match')
        return v


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


