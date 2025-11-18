# CPG-Demand-Forecaster-Project

The goal: Build a multi-step forecaster that not only predicts weekly/daily sales per SKU but also triggers autonomous reorder alerts (e.g., "Stock for Coke 12-pack will drop below safety threshold in 5 days — suggest PO to Supplier X").

Use the M5 Forecasting Accuracy dataset from Kaggle (Walmart retail sales — perfect CPG proxy: foods, hobbies, household items across stores/states)

https://www.kaggle.com/competitions/m5-forecasting-accuracy/data

Why perfect for Sarah AI?
30,000+ SKUs (items like snacks/drinks), hierarchical (item → category → department → store → state)
Daily sales over 5+ years (1941 days), with prices, promotions (snap events), calendar (holidays), and sell_price changes
Real CPG challenges: intermittency (many zeros), seasonality, promo spikes, perishable-like patterns
Used by top forecasters; benchmarks exist (WRMSSE metric)

Phase,Goals,Key Tasks,Time
1. Data Prep & EDA,Understand CPG patterns,"Load with Pandas → melt wide format → feature engineering (lags, rolling stats, holidays, price elasticity) → SQL-like queries for hierarchies",3-5 days
2. Modeling,Beat baselines,Prophet (quick wins) → LightGBM/XGBoost (tabular SOTA) → PyTorch LSTM/Transformer (your DL strength) → Ensemble,7-10 days
3. Autonomous Agent Layer,"Make it ""Sarah-like""","Forecast → calculate safety stock → if projected stock < threshold, trigger alert (email via smtplib or simulated PO JSON)",2-3 days
4. Deployment & Polish,Impress recruiters,"Streamlit/Gradio app + GCP/Heroku deploy → GitHub README with metrics + ""How this powers autonomous supply chains"" section",3-5 days

# Core Goal of Supply chain management (SCM)
Maximize customer value and achieve a sustainable competitive advantage by:

Delivering the right product
In the right quantity
At the right time
To the right place
At the lowest possible total cost
With the highest quality and sustainability standards

## Modern Trends (2025)
Visibility & Control Towers: Real-time dashboards tracking
