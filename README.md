# 🥗 NutriAI – AI-Powered Nutrition & Health App

NutriAI is an AI-powered mobile application that provides personalized health risk predictions, BMI calculations, and nutrition recommendations using FastAPI, React Native (Expo), and Gemini AI APIs.

---

## ⚙️ Prerequisites

Before getting started, ensure the following tools are installed on your system:

- ✅ [Node.js](https://nodejs.org/en)
- ✅ [Android Studio](https://developer.android.com/studio)
- ✅ [Python](https://www.python.org/downloads/)

---

## 🚀 Getting Started

### 1. Run FastAPI Backend

```bash
cd fastapi_backend
# Create a virtual environment
python -m venv <virtual_environment_name>

# Activate virtual environment (Windows)
<virtual_environment_name>\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000
