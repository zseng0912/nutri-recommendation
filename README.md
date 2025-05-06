# 🥗 NutriAI – AI-Powered Nutrition & Health App

NutriAI is an AI-powered mobile application that provides personalized health risk predictions, BMI calculations, and nutrition recommendations using FastAPI, React Native (Expo), and Gemini AI APIs.

---

## 🧰 Prerequisites

Before getting started, ensure the following tools are installed on your system:

- ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png) [**Node.js**](https://nodejs.org/en)
- ![Android Studio](https://img.icons8.com/color/48/000000/android-studio--v2.png) [**Android Studio**](https://developer.android.com/studio)
- ![Python](https://img.icons8.com/color/48/000000/python--v1.png) [**Python**](https://www.python.org/downloads/)


---

## 📥 Installation

You can get the project files in two ways:

### 📌 Option 1: Clone via Git

```bash
# Clone the repository using Git
git clone https://github.com/zseng0912/nutri-recommendation.git

# Navigate into the project folder
cd your-repo-name
```
### 📌 Option 2: Download ZIP

1. 🔗 Visit the repository on [GitHub](https://github.com/zseng0912/nutri-recommendation.git)
2. ⬇️ Click on the green **"Code"** button
3. Select **"Download ZIP"**
4. 🗂️ Extract the ZIP file to your desired location
5. 📂 Open the extracted folder in your preferred code editor

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
---

## ⚙️ Important Configuration

To enable communication between frontend and backend across your local network:

🔄 **Replace all `localhost` URLs with your local IP address.**

💡 You can find your IP address using:

- 🪟 **Windows**: Run `ipconfig` in Command Prompt
- 📱 **React Native (Expo)**: Your IP appears in the Expo Developer Tools

---

## 📝 Files to Update
✅ After updating the IPs, save the files and restart your app to apply changes.

### 📁 `nutri/src/api/`

| File              | Line to Modify                          | Replace With                                                  |
|-------------------|------------------------------------------|----------------------------------------------------------------|
| `AISuggest.js`     | Endpoint URL                            | `https://<your_local_ip>:3000/generate-ai-tips`              |
| `EstimateCalories.js` | Endpoint URL                            | `http://<your_local_ip>:3000/estimate-calories`              |
| `geminiAPI.js`      | Endpoint URL                            | `http://<your_local_ip>:3000/ai-chatbot`                     |



### 📁 `nutri/src/screen/`

| File                 | Line (Approx.) | Replace With                                                  |
|----------------------|----------------|----------------------------------------------------------------|
| `BMIResultScreen.js` | ~ Line 56      | `https://<your_local_ip>:8000/predict_obesity_risk/`         |

---

## 🌟 Key Features

Unlock a smart and personalized health experience powered by AI and data.


#### 🤖 AI-Powered Health Intelligence
- Get **tailored nutrition and health tips** generated using advanced AI models.

#### 🧮 BMI & Obesity Risk Estimation
- Instantly calculate **Body Mass Index (BMI)**.
- Predict **obesity risk levels** using ML-powered FastAPI backend.

#### 🗣️ AI Chatbot (Gemini API Integration)
- Chat with our integrated **AI assistant** for real-time health advice.
- Ask questions, get support, and interact naturally.

#### 🍱 Food Calorie Estimation
- **Estimate calorie content** of any food item.
- Automatically **update your daily intake** in real-time.

#### 📊 Progress & Health Tracking
- Monitor your **BMI, weight trends**, and **risk levels**.
- Visualize **daily calorie goals and progress** through intuitive charts.

---

## 💡 Developer Tips
Use ipconfig (Windows) or network settings to find your local IP address.

Make sure your mobile device or emulator is connected to the same network as your development machine.

---

## 📞 Support
If you encounter any issues or bugs, feel free to create a GitHub issue or contact the maintainer.
