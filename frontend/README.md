# MedTrack AI — Hospital Supply Chain Risk Dashboard

A full-stack ML-powered web application that predicts inventory stockout risk for hospital supplies and provides actionable, explainable recommendations — built as a portfolio project demonstrating an end-to-end data science + product workflow.

## Problem

Hospitals can face critical supply shortages when inventory consumption rates and supplier lead times don't align — and this often goes unnoticed until it's urgent. Manually tracking thousands of SKUs against usage patterns and restock timelines isn't scalable.

## Solution

MedTrack AI predicts which inventory items are at risk of stocking out — classified as **High / Medium / Low** risk — using a machine learning model trained on inventory, usage, and supplier data. Each prediction comes with a plain-English explanation and a recommended action, turning a raw prediction into a decision-support tool.

## Live Demo

*(Add your deployed link here once deployed)*

- Frontend: `<vercel-link>`
- Demo login: `admin` / `hospital123`

## Screenshots

*(Add screenshots here: Login, Dashboard, Analytics, Reports)*

## Architecture

Raw Inventory Data (CSV)
│
▼
Data Preprocessing & Feature Engineering (src/data_prep.py)
│
▼
Risk Labeling (rule-based: stock coverage vs. restock lead time)
│
▼
Random Forest Classifier (src/train_model.py)
│
▼
Flask REST API (backend/app.py)
├── /login — token-based authentication
├── /predict — risk prediction + explanation + recommended action
│
▼
React Frontend (frontend/)
├── Dashboard — sortable/filterable risk table, item detail panel
├── Analytics — risk distribution & category breakdown charts
└── Reports — CSV export with summary insights


## Tech Stack

**Frontend:** React, React Router, Recharts, CSS
**Backend:** Python, Flask, Flask-CORS
**ML:** scikit-learn (Random Forest), Pandas, NumPy
**Data:** Domain-informed synthetic inventory dataset (see Dataset Notes below)

## Key Features

- Token-based authentication protecting the prediction API
- Real-time risk classification across 2,500 tracked SKUs
- Explainable predictions — every risk label includes a plain-language reason
- Recommended action per item (e.g. "Urgent Restock", "Plan Replenishment")
- Sortable, searchable, filterable inventory table
- Analytics dashboard: risk distribution and category-wise breakdown
- CSV export with auto-generated summary insights

## Model Results

Two iterations were built and compared honestly rather than optimizing for a single accuracy number:

| Metric | V1 (500 rows) | V2 (2,500 rows, better class balance) |
|---|---|---|
| Overall Accuracy | 84% | 83% |
| Medium-risk Recall | 21% | 54% |
| Medium-risk F1-score | 0.26 | 0.60 |

**Why this matters:** The original dataset had severe class imbalance (only 70 Medium-risk examples out of 500), which limited the model's ability to learn that pattern — reflected in a low recall of 21%. Rather than tuning hyperparameters (which was tried and made no meaningful difference), the actual fix was generating a larger, domain-informed dataset with better class representation. Medium-risk recall more than doubled while overall accuracy stayed stable — indicating the original bottleneck was data quantity, not model choice.

The High-risk class (most critical for this use case) maintained strong recall (~97%) throughout — meaning the model reliably catches genuinely urgent items, which matters more for this application than raw accuracy alone.

## Dataset Notes

This project uses a domain-informed **synthetic** inventory dataset, not real hospital records. Risk labels are derived using a rule-based formula (days of stock coverage vs. supplier restock lead time) — this is a prototype demonstrating the full ML + product pipeline, not a model validated against real-world hospital outcomes. Real-world deployment would require validation against actual inventory and stockout history from a hospital pilot.

## Known Limitations

- Medium-risk classification, while improved, remains the weakest-performing class — more real-world data would likely improve this further
- Authentication uses a single demo account for prototype purposes; production use would require a proper user database with hashed credentials
- Model is trained on synthetic data and has not been validated against real hospital outcomes

## Project Structure

hospital-supply-chain-dashboard/
├── data/
│ ├── raw/ # original datasets
│ └── processed/ # cleaned, labeled datasets (v1 and v2)
├── notebooks/ # exploratory analysis
├── src/ # reusable ML pipeline scripts
│ ├── data_prep.py
│ ├── train_model.py
│ ├── train_model_v2.py
│ ├── generate_synthetic_data.py
│ └── predict.py
├── models/ # saved trained models (v1 and v2)
├── backend/ # Flask API
│ └── app.py
├── frontend/ # React application
│ └── src/
│ ├── pages/ # Dashboard, Analytics, Reports, Login
│ └── components/ # Sidebar
└── README.md


## How to Run Locally

**Backend:**
```bash
cd backend
pip install -r ../requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`, log in with the demo credentials above.

## What I'd Improve With More Time

- Validate the model against real hospital inventory/stockout data
- Add class-balancing techniques (e.g. SMOTE) or gather more Medium-risk examples to further close the recall gap
- Move authentication to a proper user database with hashed passwords
- Add automated tests for the data pipeline and API