<h1 align="center" id="title">vvsafsaf</h1>
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
```
### 2. Run Nutri (Main React Native App)
```bash
cd nutri
# Install Expo CLI
npm install expo

# Start the app
npx expo start

# Press "a" to launch Android emulator
# (Optional) Reset cache:
npx expo start -c
```
### 3. Run Gemini API
```bash
cd geminiAPI

# Start Server
node app.js
```

## 🔧 Important Configuration
Update localhost IP addresses for local network access. Use ipconfig (Windows) or check the IP from your Expo Developer Tools.

## ➤ Modify the following files:
### 📂 nutri/src/api/
AISuggest.js:
https://<your_local_ip>:3000/generate-ai-tips

EstimateCalories.js:
http://<your_local_ip>:3000/estimate-calories

geminiAPI.js:
http://<your_local_ip>:3000/ai-chatbot

### 📂 nutri/src/screen/
BMIResultScreen.js
Around line 56:
https://<your_local_ip>:8000/predict_obesity_risk/

## 💡 Developer Tips
Use ipconfig (Windows) or network settings to find your local IP address.

Make sure your mobile device or emulator is connected to the same network as your development machine.

## 📞 Support
If you encounter any issues or bugs, feel free to create a GitHub issue or contact the maintainer.
