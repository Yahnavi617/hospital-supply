import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

FEATURES = ['Current_Stock', 'Min_Required', 'Max_Capacity', 'Unit_Cost',
            'Avg_Usage_Per_Day', 'Restock_Lead_Time', 'Cost_Per_Item']
TARGET = 'Risk_Label'

def train_and_save_model(data_path='../data/processed/inventory_synthetic_v2.csv',
                          model_path='../models/risk_classifier_v2.pkl'):
    df = pd.read_csv(data_path)
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))

    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    return model

if __name__ == '__main__':
    train_and_save_model()