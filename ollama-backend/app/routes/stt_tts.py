import os
import uuid
import speech_recognition as sr
from fastapi import UploadFile, File, APIRouter, Depends, HTTPException
from app.dependencies import get_current_user

from gtts import gTTS
from fastapi.responses import FileResponse
from pydantic import BaseModel


router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    
@router.post("/stt")
async def speech_to_text(file: UploadFile = File(...), user: str = Depends(get_current_user)):
    temp_filename = f"temp_{uuid.uuid4().hex}.wav"
    contents = await file.read()
    with open(temp_filename, "wb") as f:
        f.write(contents)

    try:
        r = sr.Recognizer()
        with sr.AudioFile(temp_filename) as source:
            audio = r.record(source)
        text = r.recognize_google(audio)  # Replace with your offline engine if needed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.remove(temp_filename)

    return {"text": text}

@router.post("/tts")
async def text_to_speech(req: TTSRequest, user: str = Depends(get_current_user)):
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    tts = gTTS(text=req.text)
    tts.save(filename)
    return FileResponse(filename, media_type="audio/mpeg", filename="output.mp3")