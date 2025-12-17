from fastapi import APIRouter, status, HTTPException
from schemas.chat_schema import ChatRequest, ChatResponse
from langchain.messages import HumanMessage
from ml.chat_model import ChatGoogle

router = APIRouter()


@router.post("/", status_code=status.HTTP_200_OK, response_model=ChatResponse)
async def chat_model(request: ChatRequest):
    try:
        message = [HumanMessage(content=request.message)]
        result = ChatGoogle().chat(message)
        return ChatResponse(response=result.content)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating response: {str(e)}"
        )
