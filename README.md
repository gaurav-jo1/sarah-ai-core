# Sarah AI Core 🧠

**An autonomous supply-chain brain for consumer goods brands.**

## What is this?

Inspired by Sarah AI's vision for autonomous CPG ops, I built this project to move away from static dashboards and into **active intelligence**—where the software doesn't just show you data, but actually helps you manage your business.

**Problem:** Most ERPs today are just giant calculators. They are great at recording what happened (_"We sold 50 units yesterday"_), but terrible at telling you what to do next (_"You should order 200 more units from Supplier B because lead times just went up"_).

---

https://github.com/user-attachments/assets/2e755d93-2840-40ee-adc6-0a68a07e44e4

## 🚀 Key Features

### 1. Intent-Aware Chat Interface

A chat interface that routes requests based on intent, not keywords. It uses **LangGraph** to recognize the user's request type and redirects it to the appropriate tool.

- **Normal Mode:** The model responds to simple messages like "Good Morning" or "Hello" without utilizing other tools.
- **Analytical Mode (NL2SQL):** The LLM acts as a translator; it takes your plain English question, converts it into a precise database query, executes it, and formats the result back into a clear answer.
- **Forecasting Mode:** If a forecasting question is asked (e.g., _"What is the expected Demand of Chocolate next month"_), the agent uses Amazon Chronos 2 to analyze the data, look at current inventory, and provide an answer.

### 2. The AI Inventory Assistant

This feature focuses on inventory management and prescriptive analytics.

- **Inventory Overview:** Shows detailed inventory data, including the worth of products currently in stock and sell-through rates.
- **AI Insights:** A toggle switches the view to "AI Insight," which compares current stock-on-hand to what is needed for the next three months (MVP default).
- **Replenishment Calculation:** Automatically calculates the necessary replenishment and visualizes it with a bar chart showing "How much we have" vs. "How much we need."
- **AI Summary:** Provides a summary of stock levels and potential profit if the predictive model is used.
- **Generate Demand:** A button that lets you confirm the predicted units to be ordered to maximize profit.

### 3. The Forecasting Interface (Predictive Analytics)

- **Visual Forecasting:** A chart showing Units Sales or Revenue of previous months alongside future forecasts using **Amazon Chronos 2**.

### 4. Dashboards & Data Connectivity

- **Home Page:** A simple dashboard displaying Revenue, Units Sold, Units on Hand, and Top Products.
- **Data Connect:** Currently supports data ingestion via CSV and Excel files.

### 5. Invoice Intelligence (Document Automation)

A prototype demonstrating how manual document processing inside legacy ERPs can be streamlined using AI and OCR. By uploading a document, the system automates the extraction and reconciliation process.

- **Automated Extraction:** Uses AI + OCR to transform unstructured PDFs and images into structured data, reducing manual effort by up to 80%.
- **PO Matching:** Automatically identifies and links documents to their corresponding Purchase Orders or related ERP records.
- **Data Validation:** Performs cross-checks on prices, quantities, and totals, flagging any discrepancies for human review.
- **Departmental Relevance:** Designed for Finance, Accounts Payable, Procurement, and Operations teams.

🎬 _Demo video coming soon — showing the full end-to-end flow._

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
- **LangChain/LangGraph:** The framework for managing AI agents, tool routing, and stateful workflows.
- **Gemini (Google):** The primary LLM powering the chat, analytical, and reasoning tasks.
- **Amazon Chronos / PyTorch:** For the time-series forecasting models.
- **Hugging Face (Qwen3-VL-30B-A3B-Instruct & GLM-4.7):** Advanced vision and language models for document intelligence and OCR.

**Infrastructure:**

- **Docker Compose:** Orchestrates the entire ecosystem, including the **Frontend**, **Ml-Backend**, **Database** (PostgreSQL), and **Cache** (Redis).

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
   Obtain your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/api-keys).

4. **Get Hugging Face Token**
   Generate a token from your [Hugging Face Settings](https://huggingface.co/settings/tokens) for using the vision models.

5. **Create the environment file**

   ```bash
   touch ./ml-backend/.env
   ```

6. **Configure Environment Variables**
   Add the following values to your `./ml-backend/.env` file:

   ```env
   DATABASE_URL=postgresql+psycopg2://postgres_user:postgres_pass@postgres:5432/myapp_db
   REDIS_HOST=redis
   REDIS_PORT=6379

   GEMINI_API_KEY=
   HUGGING_FACE_KEY=

   POSTGRES_USER=postgres_user
   POSTGRES_PASSWORD=postgres_pass
   POSTGRES_HOST=postgres
   POSTGRES_PORT=5432
   POSTGRES_DB=myapp_db
   ```

7. **Start the services**

   ```bash
   sudo docker compose up
   ```

8. **Prepare Demo Data**
   Sample files for testing (invoices, inventory data, etc.) can be found in the `demo-data/` folder. Use these files to upload via the **Data Connect** page once the app is running.

---

> Built by [Gaurav Joshi](https://github.com/gaurav-jo1).
