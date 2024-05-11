from my_modules import stock_utils
import pandas as pd
# ----------------------------------------------------------
def stock_check(stock_data):
    close = stock_data['Close'].iloc[-1]
    sma150 = stock_data['SMA150'].iloc[-1]
    sma50 = stock_data['SMA50'].iloc[-1]
    sma200 = stock_data['SMA200'].iloc[-1]

    # find 1
    # if stock_data['High'].iloc[-1] < stock_data['High'].iloc[-2] and stock_data['Low'].iloc[-1] > stock_data['Low'].iloc[-2]:
    #     if stock_data['High'].iloc[-2] > stock_data['High'].iloc[-3] and stock_data['Low'].iloc[-2] < stock_data['Low'].iloc[-3]:
    #         if close < 50:
    #             print(stock_data.ticker)
    # print(stock_data)
    # print('###############################')
# ----------------------------------------------------------
with open('tickers/tickers_from_1B.txt', 'r') as file:
    stocks_tickers = [line.strip() for line in file]
# ----------------------------------------------------------
from sqlalchemy import create_engine

# MySQL connection parameters
db_config = {
    'host': '127.0.0.1',
    'user': 'amir',
    'password': '5590',
    'database': 'stocks'
}

# Create a SQLAlchemy engine
engine = create_engine('mysql+mysqlconnector://{user}:{password}@{host}/{database}'.format(**db_config))

# ----------------------------------------------------------
# Loop through all tickers and plot them on the same axes
for ticker in stocks_tickers:
    stock_data = stock_utils.stock_get(ticker)
    if stock_data is not False:
        stock_check(stock_data)
        stock_data.to_sql('stocks', con=engine, if_exists='append', index=True)