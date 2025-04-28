from fastapi import APIRouter, Depends, HTTPException , Query
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import httpx
import asyncio
import json
from datetime import datetime


from app.dependencies import get_current_user
from app.db import db

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/", response_class=StreamingResponse)
async def chat(req: ChatRequest, user: str = Depends(get_current_user)):
    
    async def generate():
        full_response = ""

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/generate",
                    json={
                        "model": "llama3.2",  # ✅ your correct model name
                        "prompt": req.message,
                        "stream": True,
                    },
                ) as response:
                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                data = json.loads(line)
                                chunk = data.get("response", "")
                                full_response += chunk
                                yield chunk
                                await asyncio.sleep(0)
                            except json.JSONDecodeError:
                                continue
        except httpx.HTTPError as e:
            yield f"\n[Error contacting LLaMA]: {str(e)}\n"

        # ✅ Save to MongoDB
        db.chats.insert_one({
            "user": user,
            "question": req.message,
            "answer": full_response,
            "timestamp": datetime.utcnow()
        })

    return StreamingResponse(generate(), media_type="text/plain")

@router.get("/history")
def get_chat_history(user: str = Depends(get_current_user), limit: int = Query(10)):
    history = db.chats.find({"user": user}).sort("timestamp", -1).limit(limit)
    return [
        {
            "question": chat["question"],
            "answer": chat["answer"],
            "timestamp": chat["timestamp"]
        }
        for chat in history
    ]