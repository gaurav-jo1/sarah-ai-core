from ml.chat_model import ChatModel
from schemas.chat_schema import ChatRequest
from fastapi import APIRouter, status, HTTPException
from redis_client.memory_manager import ChatMemoryManager
import uuid
from typing import Optional

router = APIRouter()


@router.get("/check", status_code=status.HTTP_200_OK)
async def check_user(session_id: Optional[str] = None):
    memory = ChatMemoryManager()

    if session_id and memory.session_exists(session_id):
        history = memory.get_history(session_id)

        return {"history": history, "session_id": session_id}

    else:
        session_id = uuid.uuid4()

        return {"history": [], "session_id": session_id}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def chat_model(request: ChatRequest):
    memory = ChatMemoryManager()

    try:
        result = ChatModel().chat(user_input=request.message)

        memory.add_message(request.session_id, role="user", content=request.message)
        memory.add_message(request.session_id, role="ai", content=result)

        return {"response": result}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating response: {str(e)}"
        )
