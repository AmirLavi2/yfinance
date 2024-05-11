from my_modules import stock_utils
# ----------------------------------------------------------
def stock_check(stock_data):
    close = stock_data['Close'].iloc[-1]
    sma150 = stock_data['SMA150'].iloc[-1]
    sma50 = stock_data['SMA50'].iloc[-1]
    sma200 = stock_data['SMA200'].iloc[-1]

    # find 1
    if stock_data['High'].iloc[-1] < stock_data['High'].iloc[-2] and stock_data['Low'].iloc[-1] > stock_data['Low'].iloc[-2]:
        if stock_data['High'].iloc[-2] > stock_data['High'].iloc[-3] and stock_data['Low'].iloc[-2] < stock_data['Low'].iloc[-3]:
            if close < 50:
                print(stock_data.ticker)
    print(stock_data)
    # print('###############################')
# ----------------------------------------------------------
with open('tickers/tickers1.txt', 'r') as file:
    stocks_tickers = [line.strip() for line in file]
# ----------------------------------------------------------
# Loop through all tickers and plot them on the same axes
for ticker in stocks_tickers:
    stock_data = stock_utils.stock_get(ticker)
    if stock_data is not False:
        stock_check(stock_data)