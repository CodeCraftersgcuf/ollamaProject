from fastapi  import APIRouter, UploadFile, File, Depends, Form, HTTPException
from app.db import db
from app.dependencies import get_current_user
from datetime import datetime
import os
import shutil
from uuid import uuid4
import pandas as pd
import httpx

router = APIRouter()

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[-1].lower()

    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    elif ext == ".xlsx":
        df = pd.read_excel(file_path, engine="openpyxl")
        return df.to_string(index=False)

    elif ext == ".pdf":
        doc = fitz.open(file_path)
        return "\n".join([page.get_text() for page in doc])

    elif ext in [".png", ".jpg", ".jpeg"]:
        return pytesseract.image_to_string(Image.open(file_path))

    raise ValueError(f"Unsupported file type: {ext}")

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    chat_id: str = Form(None),
    user: str = Depends(get_current_user)
):
    # Save file to disk
    file_id = str(uuid4())
    filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save to MongoDB
    db.files.insert_one({
        "user": user,
        "original_filename": file.filename,
        "stored_filename": filename,
        "file_path": file_path,
        "chat_id": chat_id,
        "uploaded_at": datetime.utcnow(),
    })

    return {"message": "File uploaded", "filename": filename}


@router.get("/list")
def list_user_files(
    chat_id: str = None,
    user: str = Depends(get_current_user)
):
    query = {"user": user}
    if chat_id:
        query["chat_id"] = chat_id

    files = db.files.find(query).sort("uploaded_at", -1)
    return [
        {
            "filename": f["original_filename"],
            "stored_name": f["stored_filename"],
            "uploaded_at": f["uploaded_at"],
            "chat_id": f.get("chat_id"),
        }
        for f in files
    ]
@router.post("/process")
async def process_file(
    filename: str = Form(...),
    user: str = Depends(get_current_user)
):
    from fastapi import Request
    import traceback

    file_doc = db.files.find_one({"user": user, "stored_filename": filename})
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")

    # Step 2: Extract content
    try:
        content = extract_text_from_file(file_doc["file_path"])
        if not content.strip():
            raise HTTPException(status_code=400, detail="Extracted content is empty.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to extract file content")

    # Step 3: Prepare LLaMA prompt
    prompt = f"Please summarize the following document:\n\n{content[:3000]}"

    # Step 4: Call Ollama with full error logging
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": "llama3.2", "prompt": prompt, "stream": False}
            )
            response.raise_for_status()  # ensures 4xx/5xx are caught
            data = response.json()
            print("🟢 Ollama responded:", data)
            summary = data.get("response", "No response content from Ollama")

    except httpx.HTTPStatusError as e:
        print("❌ HTTP error from Ollama:", e.response.status_code, e.response.text)
        raise HTTPException(status_code=500, detail=f"Ollama returned {e.response.status_code}: {e.response.text}")

    except httpx.RequestError as e:
        print("❌ Request error contacting Ollama:", e)
        raise HTTPException(status_code=500, detail=f"Ollama connection error: {str(e)}")

    except Exception as e:
        print("🔥 Unexpected error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Ollama failed: {str(e)}")

        # Step 6: Save summary to MongoDB
    db.file_summaries.insert_one({
    "user": user,
    "filename": file_doc["stored_filename"],
    "original_filename": file_doc["original_filename"],
    "summary": summary,
    "processed_by": "llama3.2",
    "created_at": datetime.utcnow()
})

    return {
        "summary": summary,
        "original_filename": file_doc["original_filename"],
        "processed_by": "llama3.2"
    }
    
@router.get("/summary-history")
def get_summary_history(
    user: str = Depends(get_current_user),
    filename: str = None  # Optional filter
):
    query = {"user": user}
    if filename:
        query["filename"] = filename

    records = db.file_summaries.find(query).sort("created_at", -1)

    return [
        {
            "original_filename": r.get("original_filename"),
            "summary": r.get("summary"),
            "processed_by": r.get("processed_by"),
            "created_at": r.get("created_at")
        }
        for r in records
    ]
