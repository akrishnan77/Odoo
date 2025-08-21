import pandas as pd
from prophet import Prophet
import pickle

# Example: Load historical inventory data from CSV
# Columns: date, product_id, quantity_sold
# df = pd.read_csv('inventory_history.csv')

def train_inventory_forecast_model(df, product_id):
    # Filter for product
    df_prod = df[df['product_id'] == product_id].copy()
    # Convert move_date to datetime
    df_prod['move_date'] = pd.to_datetime(df_prod['move_date'])
    # Aggregate net movement per day
    daily_net = df_prod.groupby(df_prod['move_date'].dt.date)['quantity'].sum().reset_index()
    daily_net = daily_net.rename(columns={'move_date': 'ds', 'quantity': 'net_quantity'})
    # Calculate cumulative stock on hand
    daily_net['y'] = daily_net['net_quantity'].cumsum()
    df_prophet = daily_net[['ds', 'y']]
    # Prophet expects ds as datetime
    df_prophet['ds'] = pd.to_datetime(df_prophet['ds'])
    model = Prophet()
    model.fit(df_prophet)
    # Save model
    with open(f'inventory_forecast_{product_id}.pkl', 'wb') as f:
        pickle.dump(model, f)
    return model

def predict_inventory(model, periods=30):
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    return forecast[['ds', 'yhat']].tail(periods)

# Usage:
# df = pd.read_csv('inventory_history.csv')
# model = train_inventory_forecast_model(df, product_id=123)
# forecast = predict_inventory(model, periods=30)
# print(forecast)
