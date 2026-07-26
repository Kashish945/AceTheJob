from fastapi import FastAPI
from pydantic import BaseModel
from model_loader import model, tokenizer
from prompt_templates import build_question_prompt, build_feedback_prompt
import torch
import json

app = FastAPI()

class InterviewRequest(BaseModel):
    jobRole: str
    experience: str
    jobDescription: str

class FeedbackRequest(BaseModel):
    jobRole: str
    question: str
    userAnswer: str
    


def generate_response(prompt, max_tokens=150):
    inputs = tokenizer(prompt, return_tensors="pt")

    inputs = {key: value.to(model.device) for key, value in inputs.items()}

    with torch.inference_mode():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            repetition_penalty=1.1,
            use_cache=True,
            pad_token_id=tokenizer.eos_token_id
        )

    generated_tokens = outputs[0][inputs["input_ids"].shape[-1]:]

    decoded_output = tokenizer.decode(generated_tokens, skip_special_tokens=True)

    return decoded_output
  

@app.get("/")
def home():
    return {"message": "Gemma FastAPI service is running"}


@app.post("/generate-questions")
def generate_questions(data: InterviewRequest):
    prompt = build_question_prompt(
        data.jobRole,
        data.experience,
        data.jobDescription
    )

    response = generate_response(prompt, max_tokens=120)

    return {
        "success": True,
        "questions": response
    } 
    

@app.post("/generate-feedback")
def generate_feedback(data: FeedbackRequest):
    prompt = build_feedback_prompt(
        data.jobRole,
        data.question,
        data.userAnswer
    )

    response = generate_response(prompt, max_tokens=180)

    return {
        "success": True,
        "feedback": response
    }