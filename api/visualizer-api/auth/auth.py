from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

# use env var 
SECRET_KEY = "dev-secret-key-change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def _prepare_password_for_bcrypt(pw: str) -> bytes:
    
    if isinstance(pw, str):
        b = pw.encode('utf-8')
    else:
        b = bytes(pw)
    if len(b) > 72:
        return b[:72]
    return b


def verify_password(plain_password, hashed_password):
    prepared = _prepare_password_for_bcrypt(plain_password)
    return pwd_context.verify(prepared, hashed_password)


def get_password_hash(password):
    prepared = _prepare_password_for_bcrypt(password)
    return pwd_context.hash(prepared)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return {}
