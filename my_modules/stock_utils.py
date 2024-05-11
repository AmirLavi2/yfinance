import yfinance as yf
from datetime import datetime, timedelta

def stock_get(ticker):
    today_date = datetime.now().date()
    startdate =  today_date - timedelta(days=400)
    enddate = today_date

    try:
        # Download stock data
        stock_data = yf.download(ticker, period="1d", progress=False, start=startdate, end=enddate)
        
        if stock_data.empty:
            return False

        stock_data.ticker = ticker

        # Calculate the 50-day and 150-day SMAs
        stock_data['SMA50'] = stock_data['Close'].rolling(window=50).mean()
        stock_data['SMA150'] = stock_data['Close'].rolling(window=150).mean()
        stock_data['SMA200'] = stock_data['Close'].rolling(window=200).mean()
        stock_data['ticker'] = ticker

        return stock_data

    except Exception as e:
        print(f"stock_get() {ticker} Error: {str(e)}")
        return False