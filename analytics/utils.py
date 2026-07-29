"""Analytics utility functions"""
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def calculate_kpis(df: pd.DataFrame) -> dict:
    """Calculate key performance indicators"""
    if df.empty:
        return {}
    
    return {
        'total_records': len(df),
        'min': df['y'].min(),
        'max': df['y'].max(),
        'mean': df['y'].mean(),
        'median': df['y'].median(),
        'std': df['y'].std(),
        'q25': df['y'].quantile(0.25),
        'q75': df['y'].quantile(0.75),
    }

def resample_timeseries(df: pd.DataFrame, freq: str = 'D') -> pd.DataFrame:
    """Resample time series to different frequency"""
    df = df.set_index('ds')
    return df.resample(freq)['y'].mean().reset_index()

def fill_gaps(df: pd.DataFrame, method: str = 'forward_fill') -> pd.DataFrame:
    """Fill missing values in time series"""
    df = df.set_index('ds')
    if method == 'forward_fill':
        df['y'] = df['y'].fillna(method='ffill')
    elif method == 'interpolate':
        df['y'] = df['y'].interpolate(method='linear')
    
    return df.reset_index()
