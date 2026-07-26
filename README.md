
## 📌 Overview

**AceTheJob** is an end-to-end, multi-modal AI-powered mock interview system designed to automate resume analysis, generate adaptive technical interview questions, conduct real-time response evaluation, and perform automated proctoring with behavioral analysis.

The platform bridges the gap between traditional manual recruitment processes and remote digital evaluations by combining **Natural Language Processing (NLP)**, **Large Language Models (LLMs)**, and **Computer Vision (CV)** into a unified architecture.

---

## ✨ Key Features

### 📄 1. Resume Analysis Subsystem
* **Semantic Parsing:** Converts candidate resumes (PDF/DOCX) into raw text and performs Latent Semantic Analysis using the **Gemini 2.5 Flash API**.
* **ATS Compatibility Scoring:** Evaluates candidate resumes based on Keyword Density (40%), Semantic Relevance (40%), and Structural Integrity (20%).
* **SWOT Analysis & Gap Identification:** Highlights candidate Strengths, Weaknesses, Opportunities, and Threats while generating an actionable missing-skills checklist.

### 🎙️ 2. Generative Interview Subsystem
* **Adaptive Question Generation:** Uses a fine-tuned **Gemma-2B** model to generate candidate-specific questions based on job role, job description, and experience level.
* **Interactive Medium:** Supports both text and real-time speech-to-text response inputs.
* **Multi-Dimensional Feedback:** Scores candidate responses on technical depth, clarity, relevance, missed concepts, and provides ideal benchmark answers.

### 👁️ 3. Proctoring & Behavioral Analysis Subsystem
* **Integrity Vectors (OpenCV & MediaPipe):** Real-time detection of:
  * Multiple faces in the frame
  * Candidate absence duration
  * Prohibited physical objects (e.g., mobile phones)
  * Eye-gaze tracking via Eye Aspect Ratio (EAR) and iris position
  * Screen-switching / tab-loss events
* **Behavioral Mapping:**
  * **Hand Gesture Tracking:** MediaPipe Hands monitors movement intensity to measure confidence versus anxiety.
  * **Emotion Recognition:** Deep Learning FER model categorizes facial expressions (e.g., neutral, stressed, confident).
  * **Proctoring Score:** Aggregates Integrity Consistency (60%), Confidence Index (30%), and Emotional Stability (10%).

---

## 🏗️ System Architecture

The application follows a decoupled, three-pillar framework to ensure modularity, fault tolerance, and low latency:


```

```
              +-----------------------------------+
              |         Client Dashboard          |
              |     (HTML/CSS/JS/Webcam API)      |
              +-----------------+-----------------+
                                |
                                v
              +-----------------+-----------------+
              |      Node.js / Express Backend    |
              |   (Auth, Routing, Orchestration)  |
              +--------+----------------+---------+
                       |                |
     +-----------------+                +-----------------+
     v                                                    v

```

+------------------------+                           +------------------+
|   FastAPI Microservice |                           |  MongoDB Database|
|------------------------|                           |------------------|
| • Gemini 2.5 Flash API |                           | • Users          |
| • Fine-Tuned Gemma-2B  |                           | • Resumes        |
| • OpenCV / MediaPipe   |                           | • Sessions       |
| • TensorFlow FER       |                           | • Feedback Logs  |
+------------------------+                           +------------------+

```

---

## 📊 Model Fine-Tuning & Evaluation

The fine-tuning pipeline was trained on a custom dataset of **2,906 samples** using **Parameter-Efficient Fine-Tuning (PEFT / LoRA)** with 4-bit NF4 quantization (`BitsAndBytes`) on NVIDIA Tesla T4 GPUs.

| Metric | Base Gemma-2B | Fine-Tuned Gemma-2B (5 Epochs) |
| :--- | :---: | :---: |
| **Accuracy** | 0.54 | **0.72** |
| **ROUGE-1** | 0.15 | **0.22** |
| **ROUGE-L** | 0.14 | **0.21** |
| **BERTScore** | 0.40 | **0.43** |
| **BLEU** | 0.16 | 0.13 |
| **Inference Speed** | — | **145.82 tokens/sec** |

*Gemma-2B was selected for deployment over LLaMA-3.2-3B due to superior accuracy retention, low computational overhead, and high inference speed.*

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+), Fetch & Media Devices Web APIs
* **Backend:** Node.js, Express.js (REST APIs, JWT Middleware, Multer)
* **AI Microservices & Libraries:** Python 3.10 / 3.13, FastAPI, Gemini API, TRL/SFT, LoRA (PEFT), OpenCV, MediaPipe, TensorFlow
* **Database:** MongoDB & MongoDB Compass
* **Development & API Testing:** VS Code, Postman, GitHub

---

## ⚙️ Installation & Setup

### Prerequisites
* **Python** 3.10 or 3.13
* **Node.js** v18+ and `npm`
* **MongoDB** (Running locally or MongoDB Atlas URI)
* Webcam & Microphone enabled

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/AceTheJob.git](https://github.com/your-username/AceTheJob.git)
cd AceTheJob

```

### 2. Backend Setup (Node.js)

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/acethejob
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key

```

Start the backend server:

```bash
npm start

```

### 3. AI Engine Setup (Python / FastAPI)

```bash
cd ../ai_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

```

Run the FastAPI AI microservice:

```bash
uvicorn main:app --reload --port 8000

```

### 4. Frontend Launch

Open `frontend/index.html` directly in **Google Chrome** or serve it through a local HTTP server extension.

---


---

## 👥 Contributors and There Contribution

* **Kashish Pimpalshende** : Resume analysis module, Gemma-services module, Backend
* **Sanju Mandal** : Resume analysis module, Gemma-services module, Backend
* **Disha Sakarkar** : Cheating_emotion _detection Module, Backend
* **Treksha Pachadhare** : Cheating_emotion _detection Module, Backend
* **Gayatri Chippawar** : Frontend



```