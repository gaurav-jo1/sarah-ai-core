from models.demand_forecasting import ChronosForecaster
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
# from fastapi import status

app = FastAPI()


class PredictRequest(BaseModel):
    df: list[dict]
    prediction_length: int = 2


@app.post("/predict/units")
async def predict_units(request: PredictRequest):
    df = pd.DataFrame(request.df)

    # Now you can work with the DataFrame
    print(f"Received DataFrame with {len(df)} rows")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Prediction length: {request.prediction_length}")

    model = ChronosForecaster()

    pred = model.predict_units(
        df=df[["product_id", "period", "units_sold"]],
        prediction_length=request.prediction_length,
    )

    pred["period"] = pred["period"].dt.strftime("%b %Y")

    pred["predictions"] = round(pred["predictions"])
    pred["units_0_1"] = round(pred["0.1"])
    pred["units_0_5"] = round(pred["0.5"])
    pred["units_0_9"] = round(pred["0.9"])

    pred = pred.drop(columns=["0.1", "0.5", "0.9"])

    return pred.to_dict(orient="records")


@app.post("/predict/revenue")
async def predict_revenue(request: PredictRequest):
    df = pd.DataFrame(request.df)

    print(f"Received DataFrame with {len(df)} rows")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Prediction length: {request.prediction_length}")

    model = ChronosForecaster()

    pred = model.predict_revenue(
        df=df[["product_id", "period", "units_sold", "revenue"]],
        prediction_length=request.prediction_length,
    )

    pred["period"] = pred["period"].dt.strftime("%b %Y")

    pred["predictions"] = round(pred["predictions"])
    pred["revenue_0_1"] = round(pred["0.1"])
    pred["revenue_0_5"] = round(pred["0.5"])
    pred["revenue_0.9"] = round(pred["0.9"])

    pred = pred.drop(columns=["0.1", "0.5", "0.9"])

    return pred.to_dict(orient="records")
