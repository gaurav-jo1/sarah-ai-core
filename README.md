# Sarah AI Core 🧠

**An autonomous supply-chain brain for consumer goods brands.**

> *Inspired by the concept of an "AI-native operating system," Sarah AI Core is a working prototype designed to replace legacy ERPs with an intelligent, self-driving operating system.*

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

## What is this?

Sarah AI Core is an open-source prototype for a "self-driving" supply chain.

Most ERPs today are just giant calculators. They are great at recording what happened (*"We sold 50 units yesterday"*), but terrible at telling you what to do next (*"You should order 200 more units from Supplier B because lead times just went up"*).

I built this project to move away from static dashboards and into **active intelligence**—where the software doesn't just show you data, but actually helps you manage your business.

---

## 🚀 Key Features

### 1. The Chat Interface (Conversational Analytics)
**The Concept:** Moving away from "SQL and Excel" to "Natural Language."

**How it works:**
We use a technology called **NL2SQL (Natural Language to SQL)**. The LLM acts as a translator; it takes your plain English question, converts it into a precise database query, executes it, and formats the result back into a clear answer (or a chart).

**Why we built it:**
To solve the **"Data Silo" problem**. In most companies, a manager has to email a data analyst to get a custom report. With Sarah AI, you can ask *"Show me our top 5 most profitable products in the Midwest region last quarter,"* and get an answer in 3 seconds. No SQL knowledge required.

### 2. The Forecasting Interface (Predictive Analytics)
**The Concept:** Moving from "What happened?" to "What will happen?"

**How it works:**
Instead of simple moving averages, we use modern Machine Learning models (like LSTMs or Transformers) to analyze historical sales data. We also layer in seasonality and can theoretically account for external factors like holidays or economic shifts.

**What it gives you:**
- **Baseline Forecasts:** General business growth trends to help with cash flow planning.
- **SKU-level Forecasts:** Specific predictions for every single item in your warehouse, so you know exactly what is likely to move.

### 3. The AI Inventory Assistant (Prescriptive Analytics)
This is the most advanced part of the core, combining our forecasting models with an autonomous procurement agent.

#### The "Stock vs. Demand" Visualization
We overlay your **Physical Stock (Actual)** against the **AI Forecast (Expected Demand)**.
- **The Benefit:** It immediately highlights "Red Zones" where you are predicted to run out of stock (**Stockout**) before a new shipment can arrive, or "Yellow Zones" where you have too much cash tied up in dust-gathering inventory.

#### Profit-Optimized PO Generation
When it's time to reorder, the LLM doesn't just look at "how many do we need?" It looks at **Profitability**.

It analyzes:
- **Vendor Lead Times:** *"Supplier A is cheaper, but Supplier B is faster. We need it fast."*
- **Bulk Discounts:** *"If we buy 100 more units, our margin increases by 5%."*
- **Shipping Costs:** Grouping multiple items into one Purchase Order to save on freight.

**Safety First (Human-in-the-Loop):**
Critically, the AI **never** spends money on its own. It generates a "Draft PO" for you to review. You simply check the numbers and click "Confirm." This prevents the "paperclip maximizer" problem where an AI might accidentally spend your entire budget without oversight.

---

## � The Roadmap (In Development)

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

## �🛠️ Tech Stack

This isn't just a wrapper around ChatGPT. It's a full-stack application.

**Frontend:**
- **React 19 (Vite):** Fast, modern, component-based UI.
- **Tailwind CSS v4:** For a clean, custom-looking design system.
- **Tremor / Chart.js:** For the data visualizations.

**Backend:**
- **FastAPI (Python):** Handles the API requests and orchestrates the AI agents.
- **PostgreSQL:** The primary database for sales, inventory, and product data.
- **Redis:** Used for caching and storing chat history/session data.
- **LangChain:** The framework for managing LLM chains and tools.
- **Amazon Chronos / PyTorch:** For the time-series forecasting models.

**Infrastructure:**
- **Docker Compose:** Spins up the entire ecosystem (App, DB, Cache) with one command.

---

## 🏃 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/gaurav-jo1/sarah-ai-core.git
   ```

2. **Set up `.env`**
   check `ml-backend/Dockerfile` or `docker-compose.yml` to see what variables are needed (mostly `DATABASE_URL` and `GOOGLE_API_KEY`).

3. **Run it**
   ```bash
   docker-compose up --build
   ```

4. **Visit**
   - Frontend: `http://localhost:5173`
   - Backend Docs: `http://localhost:8000/docs`

---

> Built by [Gaurav Joshi](https://github.com/gaurav-jo1).
