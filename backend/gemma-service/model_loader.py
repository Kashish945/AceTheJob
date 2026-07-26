from dotenv import load_dotenv
import os
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import PeftModel
import torch

load_dotenv()

hf_token = os.getenv("HUGGINGFACE_HUB_TOKEN")

BASE_MODEL = "google/gemma-2b"
ADAPTER_PATH = "./fine_tuned_model/results"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

tokenizer = AutoTokenizer.from_pretrained(
    BASE_MODEL,
    token=hf_token
)

base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    token=hf_token,
    device_map="auto"
)

model = PeftModel.from_pretrained(
    base_model,
    ADAPTER_PATH
)

print("model loaded successfully")