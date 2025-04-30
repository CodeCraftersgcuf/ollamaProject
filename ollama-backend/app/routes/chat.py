from fastapi import APIRouter, Depends, HTTPException, Query
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
async def chat(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    role = current_user["role"]
    
    async def generate():
        full_response = ""

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/generate",
                    json={
                        "model": "llama3.2",
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

        # ✅ Save chat in MongoDB with username + role
        db.chats.insert_one({
            "username": username,
            "role": role,
            "question": req.message,
            "answer": full_response,
            "timestamp": datetime.utcnow()
        })

    return StreamingResponse(generate(), media_type="text/plain")


@router.get("/history")
def get_chat_history(
    limit: int = Query(10),
    username: str = Query(None),  # 🔥 Only superadmin can use this
    current_user: dict = Depends(get_current_user)
):
    user_username = current_user["username"]
    user_role = current_user["role"]

    query = {}

    if user_role == "superadmin":
        if username:
            query["username"] = username  # 🔥 View specific admin's chat
    else:
        query["username"] = user_username  # Normal admins can only see their own chats

    history = db.chats.find(query).sort("timestamp", -1).limit(limit)

    return [
        {
            "question": chat["question"],
            "answer": chat["answer"],
            "timestamp": chat["timestamp"]
        }
        for chat in history
    ]
    
@router.get("/files/summary-history")
def get_summary_history(current_user: dict = Depends(get_current_user)):
    summaries = list(db.file_summaries.find({"admin_id": current_user["_id"]}))
    for s in summaries:
        s["_id"] = str(s["_id"])
        s["admin_id"] = str(s["admin_id"])
    return summaries

@router.get("/chat/history")
def get_chat_history(username: str = None, current_user: dict = Depends(get_current_user)):
    query = {}
    if current_user["role"] != "superadmin":
        query["admin_id"] = current_user["_id"]
    elif username:
        user = db.admins.find_one({"username": username})
        if user:
            query["admin_id"] = user["_id"]
    chats = list(db.chat_history.find(query))
    for chat in chats:
        chat["_id"] = str(chat["_id"])
        chat["admin_id"] = str(chat["admin_id"])
    return chats
