# Sarah AI Core 🧠🚀

**An autonomous supply-chain brain for consumer goods brands.**

> *Inspired by Sarah AI ("The AI-native operating system for consumer goods brands"), Sarah AI Core is a working prototype designed to replace legacy ERPs with an intelligent, self-driving operating system.*

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=white)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.124-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1.2-1C3C3C?logo=langchain&logoColor=white)](https://python.langchain.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.1-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.2-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Overview

Sarah AI Core is a comprehensive dashboard and autonomous agent system for managing supply chains. It leverages advanced AI for forecasting, anomaly detection, and natural language interaction to empower business owners to make data-driven decisions instantly.

This project demonstrates the power of:
- **Foundational Models for Time Series**: Using Amazon Chronos for accurate demand forecasting.
- **Large Language Models**: Utilizing Gemini for natural language queries about business data.
- **Modern Web Stack**: A high-performance UI built with React & Tailwind.

## ✨ Features

### 1. 🏠 Command Center (Homepage)
A unified view of your business health.
- **Key Metrics**: Real-time display of Monthly Revenue, Units Sold, Stock on Hand.
- **Visual Analytics**: Interactive charts showing last 6 month revenue trends and top performing products.
- **ERP-style Dashboard**: Instant visibility into what matters most.

### 2. 💬 Sarah AI Chat (Chatpage)
Talk to your supply chain.
- **Natural Language Queries**: Ask "Which products are the best selling in 2025?" and get instant, data-backed answers.
- **Powered by Gemini**: Uses Google's Gemini API with RAG (Retrieval-Augmented Generation) on your database.
- **Persistent History**: Chat history is stored in Redis, allowing you to pick up where you left off.

### 3. 📈 Advanced Forecasting
Predict the future with state-of-the-art AI.
- **Amazon Chronos 2**: Utilizes the latest Chronos foundational models for high-accuracy time-series forecasting.
- **Dual-Mode**: Toggle between **Revenue Forecasting** and **Unit Sales Forecasting**.
- **Next Month Predictions**: Get immediate insight into upcoming periods.

### 4. 📦 Autonomous Inventory (In Development 🚧)
Self-driving inventory management.
- **AI Replenishment**: Calculates reorder points, safety stock, and optimal order quantities automatically.
- **Anomaly Detection**: Detects demand spikes (z-score analysis) to prevent stockouts.
- **Actionable Suggestions**: Human-in-the-loop workflow for approving AI-generated urgency scores and suggestions.

### 5. 🔌 Data Connect
Seamless integration with your data.
- **File Upload**: Drag-and-drop CSV or Excel files to instantly populate the system.
- **Planned Integrations**:
  - Cloud Storage (Google Drive, Dropbox) 🚧
  - Existing ERP Systems 🚧

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Visualization**: Chart.js / React-Chartjs-2
- **Language**: TypeScript

### Backend
- **API**: FastAPI (Python)
- **Database**: PostgreSQL (Data), Redis (Cache & Chat History)
- **AI/ML**:
  - **Forecasting**: Amazon Chronos (via HuggingFace/Torch)
  - **LLM**: Google Gemini API via LangChain
- **Orchestration**: Docker & Docker Compose

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites
- [Docker](https://www.docker.com/get-started) & Docker Compose installed on your machine.
- API Keys for Google Gemini (if running the chat feature locally).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gaurav-jo1/sarah-ai-core.git
   cd sarah-ai-core
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `ml-backend` directory (or wherever required, check `docker-compose.yml`):
   ```bash
   # ml-backend/.env
   DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres:5432/myapp_db
   REDIS_URL=redis://redis:6379/0
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

3. **Start the Application**
   Run the entire stack with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. **Access the Dashboard**
   Open your browser and navigate to:
   - Frontend: `http://localhost:5173`
   - Backend API Docs: `http://localhost:8000/docs`

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

> Built with ❤️ by [Gaurav Joshi](https://github.com/gaurav-jo1)
