from fastapi import APIRouter, Depends, HTTPException, Form
from app.dependencies import get_current_user
from app.db import db
from app.utils.password_handler import hash_password  # ✅ correct now!

router = APIRouter()

@router.post("/create")
def create_admin(
    username: str = Form(...),
    password: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "superadmin":
        raise HTTPException(status_code=403, detail="Only superadmin can create admins")

    if db.admins.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Admin already exists")

    db.admins.insert_one({
        "username": username,
        "password": hash_password(password)
    })
    return {"message": "Admin created"}

@router.get("/list")
def list_admins(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "superadmin":
        raise HTTPException(status_code=403, detail="Only superadmin can view admins")

    admins = list(db.admins.find({}, {"password": 0}))  # hide passwords

    # 🔥 Convert ObjectId to str manually
    for admin in admins:
        admin["_id"] = str(admin["_id"])

    return admins

@router.post("/delete")
def delete_admin(username: str = Form(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "superadmin":
        raise HTTPException(status_code=403, detail="Only superadmin can delete admins")

    result = db.admins.delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"message": "Admin deleted"}

@router.post("/update-password")
def update_admin_password(username: str = Form(...), password: str = Form(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "superadmin":
        raise HTTPException(status_code=403, detail="Only superadmin can update admins")

    result = db.admins.update_one(
        {"username": username},
        {"$set": {"password": hash_password(password)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"message": "Admin password updated"}
