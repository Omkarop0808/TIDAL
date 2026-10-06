import os
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

class BeachingRiskModel:
    def __init__(self, model_path="risk_model.json"):
        self.model_path = model_path
        self.model = xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.is_trained = False
        if os.path.exists(self.model_path):
            try:
                self.model.load_model(self.model_path)
                self.is_trained = True
            except Exception as e:
                print(f"Error loading model: {e}")

    def train(self, df: pd.DataFrame, target_col="beaching_kg"):
        # Handle missing values
        df = df.fillna(0)
        
        X = df.drop(columns=[target_col, "timestamp", "zone_name"], errors='ignore')
        y = df[target_col]

        # Chronological split for time series
        # Assuming df is sorted by timestamp
        split_idx = int(len(df) * 0.8)
        X_train, X_val = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_val = y.iloc[:split_idx], y.iloc[split_idx:]

        self.model.fit(
            X_train, y_train,
            eval_set=[(X_val, y_val)],
            verbose=False
        )
        
        preds = self.model.predict(X_val)
        mae = mean_absolute_error(y_val, preds)
        r2 = r2_score(y_val, preds)
        
        self.model.save_model(self.model_path)
        self.is_trained = True
        
        return {"mae": mae, "r2": r2, "samples": len(df)}

    def predict(self, features_dict: dict):
        if not self.is_trained:
            # Fallback heuristic if untrained
            return max(0, features_dict.get("wind_speed", 10) * 15 + features_dict.get("beached_percent", 5) * 10)
            
        df = pd.DataFrame([features_dict])
        df = df.fillna(0)
        # Drop non-feature columns if present
        df = df.drop(columns=["timestamp", "zone_name"], errors='ignore')
        
        pred = self.model.predict(df)[0]
        return max(0, float(pred))

    def get_feature_contributions(self, features_dict: dict):
        if not self.is_trained:
            return {"wind_speed": 10.0, "current_speed": 5.0} # Fallback
            
        # To get SHAP values / feature contributions in xgboost
        df = pd.DataFrame([features_dict]).fillna(0).drop(columns=["timestamp", "zone_name"], errors='ignore')
        booster = self.model.get_booster()
        
        # Predict with pred_contribs=True
        contribs = booster.predict(xgb.DMatrix(df), pred_contribs=True)[0]
        
        feature_names = booster.feature_names
        # Last element is the bias term
        contrib_dict = {name: float(val) for name, val in zip(feature_names, contribs[:-1])}
        
        # Sort by absolute contribution
        sorted_contrib = dict(sorted(contrib_dict.items(), key=lambda item: abs(item[1]), reverse=True))
        return sorted_contrib

risk_model = BeachingRiskModel()
