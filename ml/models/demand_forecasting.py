import torch
from chronos import BaseChronosPipeline
from pandas import DataFrame
class ChronosForecaster:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = BaseChronosPipeline.from_pretrained(
            "amazon/chronos-2", device_map=self.device
        )

    def predict(self, df: DataFrame, prediction_length: int = 2):
        return self.model.predict_df(
            df,
            prediction_length=prediction_length,
            quantile_levels=[0.1, 0.5, 0.9],
            id_column="product_id",
            timestamp_column="period",
            target="units_sold",
        )
