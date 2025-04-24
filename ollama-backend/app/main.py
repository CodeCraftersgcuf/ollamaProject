from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, auth, files, stt_tts, subject, dashboard, blog

app = FastAPI()

# Allow frontend (adjust port if needed)
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat.router, prefix="/api/chat")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(files.router, prefix="/api/files")
app.include_router(stt_tts.router, prefix="/api/audio")
app.include_router(subject.router, prefix="/api/subject")
app.include_router(dashboard.router, prefix="/api/dashboard")
app.include_router(blog.router, prefix="/api/blog")



@app.get("/")
def root():
    return {"message": "Backend up and running!"}
