import yfinance as yf

def get_stock_data(stock, startdate, enddate, period, interval):
    try:
        yf.pdr_override()
        df = yf.download(tickers=stock, start=startdate, end=enddate, interval=interval, period=period, progress=False)
        df.reset_index(inplace=True)
        df['date'] = df['Date'].dt.date
        return df
    except Exception as e:
        print(f"An error occurred while fetching data for {stock}: {str(e)}")