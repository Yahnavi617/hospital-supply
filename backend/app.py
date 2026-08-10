import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from predict import load_model, predict_risk

app = Flask(__name__)
CORS(app)

model = load_model()
data = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'inventory_with_risk.csv'))

@app.route('/')
def home():
    return "Hospital Supply Chain Risk API is running"

@app.route('/predict', methods=['GET'])
def predict_all():
    predictions = predict_risk(model, data)
    result = data[['Item_ID', 'Item_Name', 'Current_Stock', 'Restock_Lead_Time', 'Vendor_Name']].copy()
    result['Predicted_Risk'] = predictions
    return jsonify(result.to_dict(orient='records'))

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "model_loaded": model is not None})

if __name__ == '__main__':
    app.run(debug=True, port=5000)