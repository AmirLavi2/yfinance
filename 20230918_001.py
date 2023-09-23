import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plot
from get_all_tickers import get_tickers as gt

msft = yf.Ticker('MSFT')

print(msft.info['previousClose'])

history = msft.history(period='1mo')

# print(history)

# major_indices = pd.read_html('https://finance.yahoo.com/world-indices')[0]

# print(major_indices.head())
# print(major_indices['Symbol'].str.replace('^', '').to_list())

# ticker_list = major_indices['Symbol'].str.replace('^', '').to_list()

# print(major_indices.head())

# list_of_tickers = gt.get_tickers()

# print(list_of_tickers)

tickers = open('tickers.txt', 'r')
tickerLine = tickers.readlines()
# print(tickerLine)

tickersList = []
for line in tickerLine:
    tickersList.append(line.strip())
# print(tickersList)

# tickersList = open('tickersList.txt', 'r')
# tickerLine = tickersList.readlines()
# print(tickerLine)