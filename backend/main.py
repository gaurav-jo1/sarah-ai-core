from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status
from .db.database import SessionLocal, engine
from .db import models
from .api.router import api_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Welcome to the FastAPI application!"}

@app.post("/data_connect", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    return {"filename": file.filename, "message": "File received successfully."}

app.include_router(api_router)
