import pandas as pd
import joblib

FEATURES = ['Current_Stock', 'Min_Required', 'Max_Capacity', 'Unit_Cost',
            'Avg_Usage_Per_Day', 'Restock_Lead_Time', 'Cost_Per_Item']

def load_model(model_path='../models/risk_classifier.pkl'):
    return joblib.load(model_path)

def predict_risk(model, data):
    """Predict risk labels for a dataframe of inventory items."""
    X = data[FEATURES]
    return model.predict(X)