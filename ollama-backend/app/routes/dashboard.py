# routes/dashboard.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.db import db
from app.dependencies import get_current_user
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()

class DashboardEntryIn(BaseModel):
    title: str
    content: str
    subject_id: str = None
    subobject_id: str = None

@router.post("/")
def create_entry(entry: DashboardEntryIn, user: str = Depends(get_current_user)):
    # Optional: validate ObjectId
    subject_id = ObjectId(entry.subject_id) if entry.subject_id else None
    subobject_id = ObjectId(entry.subobject_id) if entry.subobject_id else None

    result = db.dashboard.insert_one({
        "title": entry.title,
        "content": entry.content,
        "subject_id": subject_id,
        "subobject_id": subobject_id,
        "created_by": user,
        "created_at": datetime.utcnow()
    })
    return {"message": "Entry created", "id": str(result.inserted_id)}

@router.get("/")
def list_entries(user: str = Depends(get_current_user)):
    entries = db.dashboard.find({"created_by": user}).sort("created_at", -1)
    return [
        {
            "id": str(e["_id"]),
            "title": e["title"],
            "content": e["content"],
            "subject_id": str(e.get("subject_id", "")),
            "subobject_id": str(e.get("subobject_id", "")),
            "created_at": e["created_at"]
        }
        for e in entries
    ]
@router.put("/{entry_id}")
def update_entry(entry_id: str, entry: DashboardEntryIn, user: str = Depends(get_current_user)):
    try:
        entry_obj_id = ObjectId(entry_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid entry ID")

    update_result = db.dashboard.update_one(
        {"_id": entry_obj_id, "created_by": user},
        {"$set": {
            "title": entry.title,
            "content": entry.content,
            "subject_id": ObjectId(entry.subject_id) if entry.subject_id else None,
            "subobject_id": ObjectId(entry.subobject_id) if entry.subobject_id else None,
        }}
    )
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")

    return {"message": "Entry updated"}

@router.delete("/{entry_id}")
def delete_entry(entry_id: str, user: str = Depends(get_current_user)):
    try:
        entry_obj_id = ObjectId(entry_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid entry ID")

    result = db.dashboard.delete_one({"_id": entry_obj_id, "created_by": user})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")

    return {"message": "Entry deleted"}


@router.post("/{entry_id}/attach-file")
def attach_file(entry_id: str, filename: str, user: str = Depends(get_current_user)):
    file = db.files.find_one({"stored_filename": filename, "user": user})
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    db.dashboard.update_one(
        {"_id": ObjectId(entry_id), "created_by": user},
        {"$addToSet": {"file_ids": file["stored_filename"]}}
    )
    return {"message": "File linked to dashboard"}
