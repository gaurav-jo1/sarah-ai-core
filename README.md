# Mini Sarah.AI – Autonomous Supply Chain Brain Prototype

**"A fully autonomous AI COO for consumer brands – in one weekend."**

This is a **working end-to-end prototype** of what Sarah AI does today, built specifically to impress the Sarah team and prove I deeply understand their mission: replace spreadsheets, legacy ERPs, and manual ops with an intelligent, self-driving supply-chain operating system.

* 🚀 Live Demo: https://mini-sarah-ai.vercel.app
* 📹 2-Min Loom Walkthrough: https://www.loom.com/share/your-video-id
* 📂 GitHub Repo: https://github.com/yourusername/mini-sarah-ai

## What This Prototype Actually Does (Zero Hype)

1. **Ingests real ERP exports**
   → Upload any CSV / Excel file (sales history, inventory snapshots, POs – exactly what founders email you today)

2. **Real-time AI Demand Forecasting**
   → PyTorch LSTM trained on-the-fly per SKU
   → Predicts next 30 days of demand with one click

3. **Autonomous Replenishment Engine**
   → Calculates reorder points, safety stock, optimal order quantities
   → Detects demand anomalies (z-score spikes)
   → Generates actionable suggestions with urgency scoring

4. **Human-in-the-Loop Execution**
   → Suggestions queue → one-click approve/reject
   → On approval → simulates execution (email supplier, create PO, etc.)

5. **Chat Interface**
   → Ask natural questions:
   “When do we run out of Protein Bars?”
   “What should we reorder this week?”
   → Sarah answers instantly with charts and recommendations

6. **ERP-style Dashboard**
   → Live KPI cards: Inventory Turns, Weeks of Supply, Forecast Accuracy, OTIF, etc.

## Tech Stack (Deliberately Close to Sarah’s Production Stack)

| Layer              | Technology Used                  | Sarah Production Equivalent      |
|-------------------|-----------------------------------|------------------------------------|
| Frontend          | React + TypeScript + Tailwind + Recharts | React/Next.js                     |
| Backend           | FastAPI (Python)                  | Node.js + Python services         |
| Database          | PostgreSQL + Redis                | PostgreSQL + Redis                |
| ML / Forecasting  | PyTorch LSTM (on-the-fly training) | DeepSeekOCR + custom models       |
| Orchestration     | Redis queues + simple sagas       | Temporal + Kafka/RabbitMQ         |
| DevOps            | Docker Compose + GitHub Actions + GCP Cloud Run | Docker/K8s + Terraform + GCP      |
| Observability     | Basic structured logs + request tracing | OpenTelemetry + Prometheus        |

## How to Run Locally (5 minutes)

```bash
# 1. Clone & enter
git clone https://github.com/yourname/mini-sarah-ai.git
cd mini-sarah-ai

# 2. Start everything
docker-compose up --build

# 3. Open browser
http://localhost:3000