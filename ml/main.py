from models.demand_forecasting import ChronosForecaster
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
# from fastapi import status

app = FastAPI()


class PredictRequest(BaseModel):
    df: list[dict]
    prediction_length: int = 2


@app.post("/predict")
async def predict(request: PredictRequest):
    df = pd.DataFrame(request.df)

    # Now you can work with the DataFrame
    print(f"Received DataFrame with {len(df)} rows")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Prediction length: {request.prediction_length}")

    model = ChronosForecaster()

    pred = model.predict(df=df, prediction_length=request.prediction_length)

    pred['period'] = pred['period'].dt.strftime('%b %Y')

    return pred.to_dict(orient="records")
