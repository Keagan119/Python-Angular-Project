from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
from routes.routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance Analytics API")


origins = [
    "http://localhost:4200", 
    "http://127.0.0.1:4200",
   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    
    allow_credentials=True,      
    allow_methods=["*"],         
    allow_headers=["*"],         
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Finance API is running"}
