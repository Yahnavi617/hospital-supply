import os
import pandas as pd
import joblib

FEATURES = ['Current_Stock', 'Min_Required', 'Max_Capacity', 'Unit_Cost',
            'Avg_Usage_Per_Day', 'Restock_Lead_Time', 'Cost_Per_Item']

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL_PATH = os.path.join(BASE_DIR, '..', 'models', 'risk_classifier.pkl')

def load_model(model_path=DEFAULT_MODEL_PATH):
    return joblib.load(model_path)

def predict_risk(model, data):
    X = data[FEATURES]
    return model.predict(X)