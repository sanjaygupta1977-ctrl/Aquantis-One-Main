"""Anomaly detection module"""
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

def detect_anomalies_zscore(df: pd.DataFrame, window: int = 14, threshold: float = 2.0) -> list:
    """
    Detect anomalies using rolling z-score.
    
    Args:
        df: DataFrame with 'ds' and 'y' columns
        window: Rolling window size (default 14 days)
        threshold: Z-score threshold (default 2.0 = ~95% confidence)
    
    Returns:
        List of anomaly dicts with ts, value, expected, deviation, severity
    """
    df = df.sort_values('ds').copy()
    df['rolling_mean'] = df['y'].rolling(window=window, center=True).mean()
    df['rolling_std'] = df['y'].rolling(window=window, center=True).std()
    
    anomalies = []
    for _, row in df.iterrows():
        if pd.notna(row['rolling_std']) and row['rolling_std'] > 0:
            zscore = abs((row['y'] - row['rolling_mean']) / row['rolling_std'])
            if zscore > threshold:
                severity = 'high' if zscore > 3 else 'medium' if zscore > 2 else 'low'
                anomalies.append({
                    'ts': row['ds'],
                    'value': row['y'],
                    'expected': row['rolling_mean'],
                    'deviation': round(zscore, 2),
                    'severity': severity
                })
    
    return anomalies

def detect_anomalies_iqr(df: pd.DataFrame, multiplier: float = 1.5) -> list:
    """
    Detect anomalies using Interquartile Range method (robust to outliers).
    
    Args:
        df: DataFrame with 'ds' and 'y' columns
        multiplier: IQR multiplier (default 1.5)
    
    Returns:
        List of anomaly dicts
    """
    Q1 = df['y'].quantile(0.25)
    Q3 = df['y'].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - multiplier * IQR
    upper_bound = Q3 + multiplier * IQR
    
    anomalies = []
    for _, row in df.iterrows():
        if row['y'] < lower_bound or row['y'] > upper_bound:
            anomalies.append({
                'ts': row['ds'],
                'value': row['y'],
                'expected': (Q1 + Q3) / 2,
                'bounds': (lower_bound, upper_bound),
                'severity': 'high' if abs(row['y'] - Q3) > 3 * IQR else 'medium'
            })
    
    return anomalies

def detect_change_points(df: pd.DataFrame, window: int = 7) -> list:
    """Detect sudden changes in trend"""
    df = df.sort_values('ds').copy()
    df['diff'] = df['y'].diff()
    df['rolling_std_diff'] = df['diff'].rolling(window=window).std()
    
    changepoints = []
    for i in range(window, len(df)):
        if pd.notna(df.iloc[i]['rolling_std_diff']) and df.iloc[i]['rolling_std_diff'] > 0:
            zscore = abs(df.iloc[i]['diff'] / df.iloc[i]['rolling_std_diff'])
            if zscore > 3:  # Significant change
                changepoints.append({
                    'ts': df.iloc[i]['ds'],
                    'change': df.iloc[i]['diff'],
                    'severity': 'high'
                })
    
    return changepoints
