import pandas as pd

def load_data(raw_path='../data/raw'):
    """Load raw inventory and vendor datasets."""
    inventory = pd.read_csv(f'{raw_path}/inventory_data.csv')
    vendor = pd.read_csv(f'{raw_path}/vendor_data.csv')
    return inventory, vendor

def add_days_until_stockout(inventory):
    """Calculate how many days until each item runs out at current usage rate."""
    inventory['Days_Until_Stockout'] = inventory['Current_Stock'] / inventory['Avg_Usage_Per_Day']
    return inventory

def add_risk_label(inventory):
    """Label each item's risk based on stockout timing vs restock lead time."""
    def get_risk_label(row):
        ratio = row['Days_Until_Stockout'] / row['Restock_Lead_Time']
        if ratio < 1:
            return 'High'
        elif ratio < 2:
            return 'Medium'
        else:
            return 'Low'
    inventory['Risk_Label'] = inventory.apply(get_risk_label, axis=1)
    return inventory

def merge_vendor_info(inventory, vendor):
    """Attach vendor name, lead time, and cost info to each inventory row."""
    return inventory.merge(
        vendor[['Vendor_ID', 'Vendor_Name', 'Avg_Lead_Time (days)', 'Cost_Per_Item']],
        on='Vendor_ID', how='left'
    )

def build_processed_dataset(raw_path='../data/raw', save_path='../data/processed/inventory_with_risk.csv'):
    """Run the full pipeline: load, engineer features, label risk, merge vendor, save."""
    inventory, vendor = load_data(raw_path)
    inventory = add_days_until_stockout(inventory)
    inventory = add_risk_label(inventory)
    inventory = merge_vendor_info(inventory, vendor)
    inventory.to_csv(save_path, index=False)
    print(f"Processed data saved to {save_path}")
    return inventory

if __name__ == '__main__':
    build_processed_dataset()