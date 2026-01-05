import pandas as pd
import numpy as np

np.random.seed(42)

products = [
    ("P001", "Chocolate", "Snacks"),
    ("P002", "Toothpaste", "Personal Care"),
    ("P003", "Shampoo", "Personal Care"),
    ("P004", "Cereal", "Breakfast"),
    ("P005", "Soda", "Beverages"),
    ("P006", "Chips", "Snacks"),
]

months = pd.date_range(start="2021-01-01", periods=60, freq="MS")

seasonal_patterns = {
    "Snacks": [1.1, 1.0, 1.0, 1.0, 1.1, 1.2, 1.3, 1.2, 1.0, 1.1, 1.2, 1.4],
    "Personal Care": [0.9, 0.95, 1.0, 1.05, 1.1, 1.1, 1.05, 1.0, 1.0, 1.0, 1.0, 1.1],
    "Breakfast": [1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 1.0, 1.05],
    "Beverages": [0.8, 0.85, 0.95, 1.1, 1.3, 1.4, 1.5, 1.4, 1.2, 1.0, 0.9, 0.85],
}

data = []
for product_id, product_name, category in products:
    base_cost = np.random.uniform(0.5, 5.0)
    base_markup = np.random.uniform(1.3, 2.5)
    base_current_price = base_cost * base_markup

    base_demand = np.random.randint(80, 280)
    opening_stock = np.random.randint(200, 600)

    seasonal_mult = seasonal_patterns.get(category, [1.0] * 12)

    for month_idx, month_date in enumerate(months):
        period = month_date.strftime("%Y-%m")
        month_number = month_date.month
        year_number = month_date.year

        season_factor = seasonal_mult[(month_number - 1) % 12]
        year_trend = 1 + (0.02 * (year_number - 2020))
        current_price = round(base_current_price * year_trend, 2)
        opening_price = (
            base_current_price if month_idx == 0 else data[-1]["Current_Price"]
        )
        cost_per_unit = round(base_cost * year_trend * np.random.uniform(0.95, 1.05), 2)

        units_sold = int(base_demand * season_factor * np.random.uniform(0.7, 1.4))
        if np.random.random() < 0.05:
            units_sold = int(units_sold * np.random.uniform(1.5, 2.0))

        target_stock = int(base_demand * 1.5)
        ideal_receive = target_stock - opening_stock + units_sold
        stock_received = max(0, ideal_receive + np.random.randint(-60, 60))

        if np.random.random() < 0.25:
            stock_received = np.random.randint(0, 60)

        available = opening_stock + stock_received
        units_sold = min(units_sold, available)

        stock_on_hand = opening_stock + stock_received - units_sold
        stock_on_hand = max(0, stock_on_hand)

        revenue = round(units_sold * current_price, 2)

        data.append(
            {
                "Product_ID": product_id,
                "Product_Name": product_name,
                "Category": category,
                "Period": period,
                "Current_Price": current_price,
                "Opening_Price": round(opening_price, 2),
                "Cost_Per_Unit": cost_per_unit,
                "Units_Sold": units_sold,
                "Opening_Stock": opening_stock,
                "Stock_Received": stock_received,
                "Revenue": revenue,
                "Stock_On_Hand": stock_on_hand,
            }
        )

        opening_stock = stock_on_hand

df = pd.DataFrame(data)

df = df.drop_duplicates(subset=["Product_ID", "Period"]).reset_index(drop=True)

df.to_excel("cpg_inventory_60months_updated.xlsx", index=False)

print("=" * 80)
print("UPDATED DATASET GENERATED SUCCESSFULLY")
print("=" * 80)
print(f"Total Records: {len(df)}")
print(f"Products: {df['Product_Name'].nunique()}")
print(f"Time Range: {df['Period'].min()} to {df['Period'].max()}")
print("File saved: cpg_inventory_60months_updated.xlsx")
print("\nLow Stock Events (<50 units on hand):")
low_stock = df[df["Stock_On_Hand"] < 50]
print(f"{len(low_stock)} instances across dataset (great for AI alerts!)")
if len(low_stock) > 0:
    print(low_stock[["Product_Name", "Period", "Stock_On_Hand", "Units_Sold"]].head(10))

print("\nSeasonal Average Units Sold by Month:")
df["Month"] = pd.to_datetime(df["Period"]).dt.month
monthly_avg = df.groupby("Month")["Units_Sold"].mean().round(0)
month_names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]
for m, avg in monthly_avg.items():
    print(f"{month_names[m - 1]}: {int(avg)} units")
print("=" * 80)
