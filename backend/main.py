import io
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Purelytics Water Quality API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("water_model.pkl")
scaler = joblib.load("scaler.pkl")
imputer = joblib.load("imputer.pkl")

FEATURE_COLS = [
    'ph',
    'Hardness',
    'Solids',
    'Chloramines',
    'Sulfate',
    'Conductivity',
    'Organic_carbon',
    'Trihalomethanes',
    'Turbidity',
]


class WaterSample(BaseModel):
  ph: float
  Hardness: float
  Solids: float
  Chloramines: float
  Sulfate: float
  Conductivity: float
  Organic_carbon: float
  Trihalomethanes: float
  Turbidity: float


@app.get("/")
def root():
  return {
      "status": "Online",
      "message": "Purelytics Water Quality API is running",
  }


@app.post("/predict")
def predict_potability(sample: WaterSample):
  data = np.array([[
      sample.ph,
      sample.Hardness,
      sample.Solids,
      sample.Chloramines,
      sample.Sulfate,
      sample.Conductivity,
      sample.Organic_carbon,
      sample.Trihalomethanes,
      sample.Turbidity,
  ]])

  scaled_data = scaler.transform(data)
  prediction = int(model.predict(scaled_data)[0])
  probability = float(model.predict_proba(scaled_data)[0][1])

  return {
      "potable": prediction,
      "potability_score": round(probability * 100, 2),
      "status": "Safe for Consumption" if prediction == 1 else "Non-Potable",
      "disclaimer": (
          "Screening result only. Not a substitute for certified laboratory"
          " testing."
      ),
  }


@app.post("/batch-predict")
async def batch_predict(file: UploadFile = File(...)):
  contents = await file.read()
  df = pd.read_csv(io.BytesIO(contents))

  missing_cols = [col for col in FEATURE_COLS if col not in df.columns]
  if missing_cols:
    return {
        "error": (
            f"Missing required columns in uploaded CSV: {', '.join(missing_cols)}"
        )
    }

  # Extract features & impute missing values for model execution
  X = df[FEATURE_COLS]
  X_imputed = imputer.transform(X)
  X_scaled = scaler.transform(X_imputed)

  # Make model predictions
  predictions = model.predict(X_scaled)
  probabilities = model.predict_proba(X_scaled)[:, 1]

  # Append prediction columns to DataFrame
  df['Potability_Prediction'] = predictions
  df['Potability_Score'] = np.round(probabilities * 100, 2)
  df['Status'] = np.where(
      predictions == 1, 'Safe for Consumption', 'Non-Potable'
  )

  potable_count = int((predictions == 1).sum())
  non_potable_count = int((predictions == 0).sum())
  total_samples = len(df)

  # FIX: Replace NaN values with None so json.dumps() converts them to null instead of crashing
  clean_df = df.astype(object).replace({np.nan: None})

  return {
      "summary": {
          "total_samples": total_samples,
          "potable_count": potable_count,
          "non_potable_count": non_potable_count,
          "potability_rate": round((potable_count / total_samples) * 100, 2),
      },
      "predictions": clean_df.to_dict(orient="records")[:50],
  }