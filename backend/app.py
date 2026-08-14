import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from predict import load_model, predict_risk

app = Flask(__name__)
CORS(app)

model = load_model(os.path.join(os.path.dirname(__file__), '..', 'models', 'risk_classifier_v2.pkl'))
data = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'inventory_synthetic_v2.csv'))

@app.route('/')
def home():
    return "Hospital Supply Chain Risk API is running"

@app.route('/predict', methods=['GET'])
def predict_all():
    predictions = predict_risk(model, data)
    result = data[['Item_ID', 'Item_Name', 'Current_Stock', 'Restock_Lead_Time', 'Vendor_Name', 'Avg_Usage_Per_Day']].copy()
    result['Predicted_Risk'] = predictions
    result['Days_Until_Stockout'] = (result['Current_Stock'] / result['Avg_Usage_Per_Day'].replace(0, 0.01)).round(1)
    result['Reason'] = result.apply(
        lambda row: f"Stock covers ~{row['Days_Until_Stockout']} days, but restock takes {row['Restock_Lead_Time']} days",
        axis=1
    )
    return jsonify(result.to_dict(orient='records'))

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "model_loaded": model is not None})

if __name__ == '__main__':
    app.run(debug=True, port=5000)