"""Forecasting module using Prophet"""
import pandas as pd
import logging
from fbprophet import Prophet

logger = logging.getLogger(__name__)

def forecast_timeseries(df: pd.DataFrame, periods: int = 30) -> pd.DataFrame:
    """
    Forecast using Prophet. Expects DataFrame with 'ds' (timestamp) and 'y' (value) columns.
    
    Args:
        df: DataFrame with 'ds' and 'y' columns
        periods: Number of periods to forecast (default 30 days)
    
    Returns:
        DataFrame with forecast results (yhat, yhat_lower, yhat_upper)
    """
    try:
        model = Prophet(yearly_seasonality=True, daily_seasonality=False)
        model.fit(df)
        
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        
        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    except Exception as e:
        logger.error(f"Forecasting error: {e}")
        return pd.DataFrame()

def calculate_anomalies_prophet(df: pd.DataFrame, threshold: float = 2.0) -> list:
    """Detect anomalies using Prophet's prediction intervals"""
    forecast = forecast_timeseries(df)
    
    anomalies = []
    for _, row in df.iterrows():
        matching = forecast[forecast['ds'] == row['ds']]
        if not matching.empty:
            pred = matching.iloc[0]
            if row['y'] < pred['yhat_lower'] or row['y'] > pred['yhat_upper']:
                anomalies.append({
                    'ts': row['ds'],
                    'value': row['y'],
                    'expected': pred['yhat'],
                    'lower': pred['yhat_lower'],
                    'upper': pred['yhat_upper']
                })
    
    return anomalies
