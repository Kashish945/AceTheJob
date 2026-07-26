def build_question_prompt(job_role, experience, job_description):
  return f"""
    system: You are an expert technical interviewer. Based on the Role, Skills, and Level provided by the user, generate 10 relevant, and challenging interview questions. Make sure that the first question always be "Tell me about yourself ?".

    user:
      Role: {job_role}
      Skills: {job_description}
      Level: {experience}

    assistant:
      Return response ONLY in JSON format:
      {{
        "questions": []
      }}
  """

def build_feedback_prompt(job_role, question, user_answer):
    return f"""
System: You are an expert interview coach. Your task is to analyze the user's answer and provide feedback.

User:
Question: {question}
User Answer: {user_answer}

Return ONLY JSON:
{{
  "correctAnswer": "",
  "score": 0,
  "improvements": []
}}

Assistant:
"""