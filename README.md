# 🥗 Shred-Macros  

**AI-powered Recipe & Nutrition Assistant** 🍳💪  

Shred-Macros is a **full-stack AI-powered recipe generator app** that helps users create, customize, and share recipes while tracking macros.  
Built with **React, Node.js, FastAPI, LangChain, and LLMs**, this project showcases **cross-stack communication** and cutting-edge AI integration.  

---

## 🚀 Features  

✨ **AI Recipe Generator** – Get recipes by choosing veg/non-veg, adding ingredients, and cooking time.  
✨ **Smart Substitutions** – Handles missing items (e.g., “no onions”) with intelligent alternatives.  
✨ **Macro & Micro Tracking** – Option to include nutrition breakdown.  
✨ **Chat-like Interaction** – AI remembers context with conversation history.  
✨ **Share Recipes** – Save and share complete recipes with title, ingredients, instructions, macros, and image.  

---

## 🛠️ Tech Stack  

**Frontend**: ⚛️ React (Chat UI, recipe form, sharing interface)  
**Backend**: 🟢 Node.js + Express (API gateway, routing, MongoDB connection)  
**AI Service**: 🐍 FastAPI + LangChain + LLM (recipe generation, memory, structured output)  
**Database**: 🍃 MongoDB (storing shared recipes)  

---

## 🔗 Architecture  

**React Frontend** <--> **Node.js Backend** <--> **FastAPI + LangChain + LLM Service**  
↳ Ensures **seamless cross-communication** between all layers.  

---


## ⚡ Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/aryansinha1818/Shred-Macros.git
cd Shred-Macros
```

2️⃣ Install Dependencies
Frontend
```bash
cd client
npm install
npm start
```
Backend
```bash
cd server
npm install
npm run dev
```
AI Service (Python FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

👨‍💻 Author : 
Aryan Sinha
## 🔗 Links
[![email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:aryan.sinha1818@gmail.com)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aryan-sinha-877698212/)
