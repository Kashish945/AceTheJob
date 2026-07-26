from fastapi import FastAPI
from pydantic import BaseModel
import threading
from main import run_interview_session, get_final_report

app = FastAPI()

class InterviewRequest(BaseModel):
    userId: str
    interviewId: str

active_sessions = {}

@app.get("/")
def home():
    return {
        "message": "Cheating Detection Service Running"
    }

@app.post("/start-session")
def start_session(data: InterviewRequest):
    thread = threading.Thread(
        target=run_interview_session,
        args=(data.userId, data.interviewId)
    )

    thread.daemon = True
    thread.start()

    active_sessions[data.interviewId] = {
        "userId": data.userId,
        "status": "running"
    }

    return {
        "success": True,
        "message": "Interview cheating detection started"
    }

@app.post("/generate-report")
def generate_report(data: InterviewRequest):
    report = get_final_report(
        user_id=data.userId,
        interview_id=data.interviewId
    )

    return {
        "success": True,
        "report": report
    }