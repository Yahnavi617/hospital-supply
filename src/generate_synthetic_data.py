import numpy as np
import pandas as pd

np.random.seed(42)  # reproducibility

N_ROWS = 2500

# Category-specific realistic ranges
# (min_stock, max_stock), (min_required_pct_of_stock range),
# (usage_per_day range), (lead_time range in days)
CATEGORIES = {
    "Medicines": {
        "items": ["Insulin", "Antibiotic", "Painkiller", "Antihistamine", "Antiviral"],
        "stock_range": (100, 3000),
        "usage_range": (5, 150),
        "lead_time_range": (3, 14),
        "unit_cost_range": (10, 500),
    },
    "Surgical Supplies": {
        "items": ["Surgical Gloves", "Syringes", "Sutures", "Surgical Mask", "Gauze"],
        "stock_range": (200, 5000),
        "usage_range": (20, 400),
        "lead_time_range": (2, 10),
        "unit_cost_range": (2, 100),
    },
    "IV & Emergency Supplies": {
        "items": ["IV Fluid", "Cannula", "Emergency Kit", "Oxygen Mask", "Defibrillator Pads"],
        "stock_range": (150, 2500),
        "usage_range": (10, 200),
        "lead_time_range": (2, 7),
        "unit_cost_range": (15, 800),
    },
    "Diagnostic Supplies": {
        "items": ["Test Kit", "Reagent", "Blood Collection Tube", "X-ray Film"],
        "stock_range": (300, 4000),
        "usage_range": (5, 80),
        "lead_time_range": (5, 20),
        "unit_cost_range": (20, 600),
    },
    "Equipment/Consumables": {
        "items": ["Thermometer", "BP Monitor Cuff", "Ventilator Filter", "Small Equipment"],
        "stock_range": (50, 1500),
        "usage_range": (2, 60),
        "lead_time_range": (3, 15),
        "unit_cost_range": (50, 20000),
    },
}

VENDORS = [
    ("V001", "MedSupplies Inc."),
    ("V002", "EquipMed Co."),
    ("V003", "HealthTools Ltd."),
    ("V004", "CarePlus Distributors"),
    ("V005", "PrimeMed Supply Chain"),
]


def generate_rows(n_rows):
    rows = []
    category_names = list(CATEGORIES.keys())

    for i in range(n_rows):
        category = np.random.choice(category_names)
        config = CATEGORIES[category]

        item_name = np.random.choice(config["items"])

        avg_usage_per_day = np.random.randint(*config["usage_range"])
        restock_lead_time = np.random.randint(*config["lead_time_range"])

        # Tie current stock to a "days of cover" figure instead of picking it
        # independently. This mirrors reality: stock naturally correlates with
        # usage rate, so we sample how many days of cover an item currently has
        # (skewed toward realistic scenarios, wide enough to cover High/Medium/Low)
        days_of_cover = np.random.choice(
            np.concatenate([
                np.random.uniform(0.3, 1.0, 30),   # High-risk-leaning
                np.random.uniform(1.0, 2.5, 35),   # Medium-risk-leaning
                np.random.uniform(2.5, 8.0, 35),   # Low-risk-leaning
            ])
        )
        current_stock = max(1, int(avg_usage_per_day * days_of_cover * restock_lead_time))

        # min required is typically 10-30% of a "full" stock level
        min_required = int(current_stock * np.random.uniform(0.10, 0.35))
        max_capacity = int(current_stock * np.random.uniform(1.2, 2.5))
        unit_cost = round(np.random.uniform(*config["unit_cost_range"]), 2)

        vendor_id, vendor_name = VENDORS[np.random.randint(0, len(VENDORS))]
        cost_per_item = round(unit_cost * np.random.uniform(0.8, 1.1), 2)

        rows.append({
            "Item_ID": 1000 + i,
            "Category": category,
            "Item_Name": item_name,
            "Current_Stock": current_stock,
            "Min_Required": min_required,
            "Max_Capacity": max_capacity,
            "Unit_Cost": unit_cost,
            "Avg_Usage_Per_Day": avg_usage_per_day,
            "Restock_Lead_Time": restock_lead_time,
            "Vendor_ID": vendor_id,
            "Vendor_Name": vendor_name,
            "Cost_Per_Item": cost_per_item,
        })

    return pd.DataFrame(rows)


def add_days_until_stockout(df):
    # Same protection against zero usage as in src/data_prep.py
    df["Days_Until_Stockout"] = df["Current_Stock"] / df["Avg_Usage_Per_Day"].replace(0, 0.01)
    return df


def add_risk_label(df):
    # SAME rule as the original dataset — not a new/different definition
    def get_risk_label(row):
        ratio = row["Days_Until_Stockout"] / row["Restock_Lead_Time"]
        if ratio < 1:
            return "High"
        elif ratio < 2:
            return "Medium"
        else:
            return "Low"
    df["Risk_Label"] = df.apply(get_risk_label, axis=1)
    return df


def main():
    df = generate_rows(N_ROWS)
    df = add_days_until_stockout(df)
    df = add_risk_label(df)

    print("Shape:", df.shape)
    print()
    print("Risk label distribution:")
    print(df["Risk_Label"].value_counts())
    print()
    print("Risk label distribution (%):")
    print((df["Risk_Label"].value_counts(normalize=True) * 100).round(1))

    out_path = "../data/processed/inventory_synthetic_v2.csv"
    df.to_csv(out_path, index=False)
    print(f"\nSaved to {out_path}")


if __name__ == "__main__":
    main()