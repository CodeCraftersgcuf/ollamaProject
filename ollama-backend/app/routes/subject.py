from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.db import db
from app.dependencies import get_current_user
from bson import ObjectId

router = APIRouter()

class SubjectIn(BaseModel):
    name: str

class SubobjectIn(BaseModel):
    subject_id: str
    name: str

@router.post("/")
def create_subject(subject: SubjectIn, user: str = Depends(get_current_user)):
    result = db.subjects.insert_one({
        "name": subject.name,
        "created_by": user
    })
    return {
        "message": "Subject created",
        "id": str(result.inserted_id)
    }


@router.post("/subobject")
def create_subobject(sub: SubobjectIn, user: str = Depends(get_current_user)):
    from bson.errors import InvalidId

    try:
        subject_obj_id = ObjectId(sub.subject_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid subject_id format")

    subject = db.subjects.find_one({"_id": subject_obj_id})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.subobjects.insert_one({
        "name": sub.name,
        "subject_id": sub.subject_id,
        "created_by": user
    })
    return {"message": "Subobject added"}

@router.get("/list")
def get_subjects(user: str = Depends(get_current_user)):
    return [
        {"id": str(s["_id"]), "name": s["name"]}
        for s in db.subjects.find({"created_by": user})
    ]

@router.get("/subobject/list/{subject_id}")
def get_subobjects(subject_id: str, user: str = Depends(get_current_user)):
    return [
        {"id": str(s["_id"]), "name": s["name"]}
        for s in db.subobjects.find({"subject_id": subject_id, "created_by": user})
    ]
