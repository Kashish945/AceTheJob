
used latest python version

activate python environment :- venv/Scripts/Activate.ps1

install all requirenments:- pip install -m requirements.txt 

set HF_TOKEN=your_token_here in dot env file (HF token means huggingface token of your model)

pip install python-dotenv

upload the result file of your interview model in "gemma-service/fine_tuned_model"

run python backend : uvicorn app:app --reload --host 0.0.0.0 --port 8000


