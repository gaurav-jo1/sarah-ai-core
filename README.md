# Sarah AI Core 🧠

**An autonomous supply-chain brain for consumer goods brands.**


## What is this?

Inspired by Sarah AI's vision for autonomous CPG ops, I built this project to move away from static dashboards and into **active intelligence**—where the software doesn't just show you data, but actually helps you manage your business.

**Problem:** Most ERPs today are just giant calculators. They are great at recording what happened (*"We sold 50 units yesterday"*), but terrible at telling you what to do next (*"You should order 200 more units from Supplier B because lead times just went up"*).

---

## 🚀 Key Features

### 1. Intent-Aware Chat Interface
A chat interface that routes requests based on intent, not keywords. It uses **LangGraph** to recognize the user's request type and redirects it to the appropriate tool.

- **Normal Mode:** The model responds to simple messages like "Good Morning" or "Hello" without utilizing other tools.
- **Analytical Mode (NL2SQL):** The LLM acts as a translator; it takes your plain English question, converts it into a precise database query, executes it, and formats the result back into a clear answer.
- **Forecasting Mode:** If a forecasting question is asked (e.g., *"What is the expected Demand of Chocolate next month"*), the agent uses Amazon Chronos 2 to analyze the data, look at current inventory, and provide an answer.

### 2. The AI Inventory Assistant
This feature focuses on inventory management and prescriptive analytics.

- **Inventory Overview:** Shows detailed inventory data, including the worth of products currently in stock and sell-through rates.
- **AI Insights:** A toggle switches the view to "AI Insight," which compares current stock-on-hand to what is needed for the next three months (MVP default).
- **Replenishment Calculation:** Automatically calculates the necessary replenishment and visualizes it with a bar chart showing "How much we have" vs. "How much we need."
- **AI Summary:** Provides a summary of stock levels and potential profit if the predictive model is used.
- **Generate Demand:** A button that lets you confirm the predicted units to be ordered to maximize profit.

### 3. The Forecasting Interface (Predictive Analytics)
- **Visual Forecasting:** A chart showing Units Sales or Revenue of previous months alongside future forecasts using **Amazon Chronos**.

### 4. Dashboards & Data Connectivity
- **Home Page:** A simple dashboard displaying Revenue, Units Sold, Units on Hand, and Top Products.
- **Data Connect:** Currently supports data ingestion via CSV and Excel files.

---

## 🗺️ The Roadmap (In Development)

### 🌅 The "Morning Briefing" Agent
Instead of starting your day digging through dashboards, Sarah sends you a curated **Executive Summary** at 8:00 AM via WhatsApp, Telegram, or Slack.

**The Content:**
- **Financials:** "Yesterday's Revenue: $12k (vs Target: $10k) 🚀"
- **Inventory Health:** "95% In Stock. 2 items at risk of stockout."
- **Top Performer:** "Product X was the winner yesterday."
- **The To-Do List:** AI-prioritized tasks that need your attention (e.g., "3 POs awaiting approval").

### 🚨 Real-Time "Anomaly Alerts"
While the morning briefing is for planning, these are for immediate action.

- **Critical Stock Alerts:** *"Alert: SKU-104 just dropped below safety levels due to an unexpected bulk order. Reorder now?"*
- **Finance Alerts:** *"Large Payment Received: $50,000 from Client X."*

---

## 🛠️ Tech Stack

**Frontend:**
- **React 19 (Vite):** Fast, modern, component-based UI.
- **Tailwind CSS v4:** For a clean, custom-looking design system.
- **Chart.js:** For the data visualizations.

**Backend:**
- **FastAPI (Python):** Handles the API requests and orchestrates the AI agents.
- **PostgreSQL:** The primary database for sales, inventory, and product data.
- **Redis:** Used for caching and storing chat history/session data.
- **LangChain/LangGraph:** The framework for managing LLM chains and tools.
- **Amazon Chronos / PyTorch:** For the time-series forecasting models.

**Infrastructure:**
- **Docker Compose:** Spins up the entire ecosystem (App, DB, Cache) with one command.

---

## 🏃 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/gaurav-jo1/sarah-ai-core
   cd sarah-ai-core
   ```

2. **Install `uv`**
   ```bash
   pip install uv
   ```

3. **Get Gemini API Key**
   Get your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/api-keys).

4. **Create the environment file**
   ```bash
   touch ./ml-backend/.env
   ```

5. **Configure Environment Variables**
   Add the following values to your `./ml-backend/.env` file:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres_user:postgres_pass@postgres:5432/myapp_db
   REDIS_HOST=redis
   REDIS_PORT=6379

   GEMINI_API_KEY=

   POSTGRES_USER=postgres_user
   POSTGRES_PASSWORD=postgres_pass
   POSTGRES_HOST=postgres
   POSTGRES_PORT=5432
   POSTGRES_DB=myapp_db
   ```

6. **Start the services**
   ```bash
   sudo docker compose up
   ```

7. **Set up Python Virtual Environment**
   ```bash
   uv venv
   ```

8. **Activate Virtual Environment**
   ```bash
   source .venv/bin/activate
   ```

9. **Install Python Dependencies**
   ```bash
   uv pip install -r requirements-dev.txt
   ```

10. **Generate Mock Data**
    Run the mock data generation script and upload the result on the Data Connect Page:
    ```bash
    python generate_mock_data.py
    ```

---

> Built by [Gaurav Joshi](https://github.com/gaurav-jo1).
