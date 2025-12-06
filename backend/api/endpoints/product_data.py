from fastapi import APIRouter
from fastapi import status
from fastapi import UploadFile, File

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Welcome to the FastAPI application!"}

@router.post("/data_connect", status_code=status.HTTP_201_CREATED)
async def data_connect(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    return {"filename": file.filename, "message": "File received successfully."}
