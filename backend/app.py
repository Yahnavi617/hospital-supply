import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from flask import Flask, jsonify
import secrets
from flask_cors import CORS
import pandas as pd
from predict import load_model, predict_risk

app = Flask(__name__)
CORS(app)

# --- Simple demo authentication ---
# NOTE: single hardcoded demo account for prototype purposes.
# In production this would be a hashed-password database with per-user accounts.
DEMO_USERNAME = "admin"
DEMO_PASSWORD = "hospital123"
valid_tokens = set()

@app.route('/login', methods=['POST'])
def login():
    from flask import request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == DEMO_USERNAME and password == DEMO_PASSWORD:
        token = secrets.token_hex(16)
        valid_tokens.add(token)
        return jsonify({"token": token})
    else:
        return jsonify({"error": "Invalid username or password"}), 401


def require_auth(f):
    from functools import wraps
    from flask import request
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '')
        if token not in valid_tokens:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

model = load_model(os.path.join(os.path.dirname(__file__), '..', 'models', 'risk_classifier_v2.pkl'))
data = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'inventory_synthetic_v2.csv'))

@app.route('/')
def home():
    return "Hospital Supply Chain Risk API is running"


@app.route('/predict', methods=['GET'])
@require_auth
def predict_all():
    predictions = predict_risk(model, data)
    result = data[['Item_ID', 'Item_Name', 'Category', 'Current_Stock', 'Restock_Lead_Time', 'Vendor_Name', 'Avg_Usage_Per_Day']].copy()
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