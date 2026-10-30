import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import KNNImputer
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

# 1. Load Data
df = pd.read_csv('../dataset/water_potability.csv')

# 2. Handle Missing Values (ph, Sulfate, Trihalomethanes)
X = df.drop(columns=['Potability'])
y = df['Potability']

imputer = KNNImputer(n_neighbors=5)
X_imputed = imputer.fit_transform(X)

# 3. Train Test Split & Standard Scaling
X_train, X_test, y_train, y_test = train_test_split(
    X_imputed, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Model Training
model = XGBClassifier(
    n_estimators=100, learning_rate=0.05, max_depth=5, random_state=42
)
model.fit(X_train_scaled, y_train)

# 5. Save Artifacts
joblib.dump(model, 'water_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(imputer, 'imputer.pkl')

print('Model artifacts successfully trained and saved!')