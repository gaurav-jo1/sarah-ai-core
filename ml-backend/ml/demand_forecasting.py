import torch
from chronos import BaseChronosPipeline
import pandas as pd
from pandas import DataFrame


class ChronosForecaster:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = BaseChronosPipeline.from_pretrained(
            "amazon/chronos-2", device_map=self.device
        )

    async def predict_units(self, df: DataFrame, prediction_length: int = 2):
        df = pd.DataFrame(df)

        df = df[["product_id", "period", "units_sold"]]

        pred = self.model.predict_df(
            df,
            prediction_length=prediction_length,
            quantile_levels=[0.1, 0.5, 0.9],
            id_column="product_id",
            timestamp_column="period",
            target="units_sold",
        )

        pred["period"] = pred["period"].dt.strftime("%b %Y")

        pred["predictions"] = round(pred["predictions"])
        pred["units_0_1"] = round(pred["0.1"])
        pred["units_0_5"] = round(pred["0.5"])
        pred["units_0_9"] = round(pred["0.9"])

        pred = pred.drop(columns=["0.1", "0.5", "0.9"])

        return pred.to_dict(orient="records")

    async def predict_units_raw(self, df: DataFrame, prediction_length: int = 2):
        df = pd.DataFrame(df)

        df = df[["product_id", "period", "units_sold"]]

        pred = self.model.predict_df(
            df,
            prediction_length=prediction_length,
            quantile_levels=[0.1, 0.5, 0.9],
            id_column="product_id",
            timestamp_column="period",
            target="units_sold",
        )

        pred["predictions"] = round(pred["predictions"])
        pred["0.1"] = round(pred["0.1"])
        pred["0.5"] = round(pred["0.5"])
        pred["0.9"] = round(pred["0.9"])

        return pred.to_dict(orient="records")

    async def predict_revenue(self, df: DataFrame, prediction_length: int = 2):
        df = pd.DataFrame(df)

        df = df[["product_id", "period", "units_sold", "revenue"]]

        pred = self.model.predict_df(
            df,
            prediction_length=prediction_length,
            quantile_levels=[0.1, 0.5, 0.9],
            id_column="product_id",
            timestamp_column="period",
            target="revenue",
        )

        pred["period"] = pred["period"].dt.strftime("%b %Y")

        pred["predictions"] = round(pred["predictions"])
        pred["revenue_0_1"] = round(pred["0.1"])
        pred["revenue_0_5"] = round(pred["0.5"])
        pred["revenue_0.9"] = round(pred["0.9"])

        pred = pred.drop(columns=["0.1", "0.5", "0.9"])

        return pred.to_dict(orient="records")
