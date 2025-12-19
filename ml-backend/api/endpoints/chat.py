# from typing import Optional
from ml.chat_model import ChatGoogle
from schemas.chat_schema import ChatRequest
from fastapi import APIRouter, status, HTTPException
# from redis.memory_manager import ChatMemoryManager

router = APIRouter()
# @router.get("/check", status_code=status.HTTP_200_OK)
# async def check_user(user_id: Optional[str] = None):
#     memory = ChatMemoryManager()

#     if user_id and memory.session_exists(user_id):
#         history = memory.get_history(user_id)

#         return {"history": history, "status": status.HTTP_200_OK}

#     return {"history": False, "status": status.HTTP_200_OK}

@router.post("/", status_code=status.HTTP_201_CREATED)
async def chat_model(request: ChatRequest):
    try:
        result = ChatGoogle().chat(question=request.message)
        return {"response": result}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating response: {str(e)}"
        )