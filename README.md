# Hospital Supply Chain Risk & Replenishment Dashboard

Predicts stock shortages and prioritizes replenishment for hospital ops teams — trained and validated on public/synthetic supply chain datasets (no patient-identifying data used or required).

## Objective
Translate raw inventory/consumption data into a business-facing risk score so non-technical hospital ops teams can quickly see which items are at risk of stocking out and act before it becomes urgent.

## Tech Stack
- Python, Pandas, Scikit-learn (ML pipeline)
- Flask (backend API)
- React (frontend dashboard)

## Status
✅ Data pipeline, feature engineering, and model training complete.
🚧 Backend API and React dashboard in progress.

## Disclaimer
Uses public/synthetic supply chain datasets adapted for a hospital inventory context. Portfolio/learning project — not connected to any real hospital's data or operations.

## Dataset & Model Notes

**Synthetic data:** This project uses domain-informed synthetic inventory data, not real hospital records. Risk labels are derived using a rule-based formula (Days_Until_Stockout vs Restock_Lead_Time), not independent ground truth — this is a proof-of-concept demonstrating the full ML + product pipeline. Real-world deployment would require validation against actual hospital inventory and stockout history.

**Model iteration (v1 → v2):**

| Metric | V1 (500 rows) | V2 (2500 rows, better class balance) |
|---|---|---|
| Overall Accuracy | 84% | 83% |
| Medium-class Recall | 21% | 54% |
| Medium-class F1 | 0.26 | 0.60 |

The original dataset had severe class imbalance (only 70 Medium-risk examples out of 500), which limited the model's ability to learn that pattern. A larger, category-based synthetic dataset (2500 rows across 5 item categories) with better class representation significantly improved Medium-class performance while keeping overall accuracy stable — showing this was a data quantity issue, not a model tuning issue.