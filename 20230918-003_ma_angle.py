# TODO: Build output object
# TODO: clean code
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import yfinance as yf
import time
import datetime

# constants
LONG_MA = 200 #150
PERIOD = '1d'
START_DATE = '2022-03-22'
END_DATE = datetime.datetime.now() #'2023-09-22'
INTERVAL = '1d'
FILE_NAME = 'tickers_200B.txt'
# FILE_NAME = 'tickers_2B-10B.txt'

# functions
def get_stock_data(stock, startdate, enddate, period, interval):
    try:
        ticker = stock
        yf.pdr_override()
        df = yf.download(tickers=stock, start=startdate, end=enddate, interval=interval, period=period, progress=False)
        df.reset_index(inplace=True)
        df['date'] = df['Date'].dt.date
        return df
    except Exception as e:
        print(f"An error occurred while fetching data for {stock}: {str(e)}")

def calc_close_moving_average_angle(data, ma):
    ma_series = data['Close'].rolling(int(ma)).mean()
    if ma_series.iloc[-1] > ma_series.iloc[-2]:
        return ma_series.iloc[-1] / ma_series.iloc[-2]
    else:
        return -10000

def closest_to_moving_average(data, ma):
    ma_series = data['Close'].rolling(int(ma)).mean()
    ma_value = ma_series.iloc[-1]
    if data['Close'].iloc[-1] > ma_value:
        return data['Close'].iloc[-1] / ma_value
    else:
        return 10000

def main():
    # Measure the start time
    start_time = time.time()

    tickers = open(FILE_NAME, 'r')
    ticker_lines = tickers.readlines()
    stocks_dict_min = {}
    stocks_dict_max = {}

    for line in ticker_lines:
        df = get_stock_data(line, START_DATE, END_DATE, PERIOD, INTERVAL)
        if df is not None:
            cma_angle = calc_close_moving_average_angle(df, LONG_MA)
            stocks_dict_max[line] = cma_angle

            closest_ma = closest_to_moving_average(df, LONG_MA)
            stocks_dict_min[line] = closest_ma

    min_value = min(stocks_dict_min, key=lambda x: stocks_dict_min[x])
    max_value = max(stocks_dict_max, key=lambda x: stocks_dict_max[x])

    print(stocks_dict_min)
    print(stocks_dict_max)
    print(f'Closest to MA {LONG_MA}: {min_value}')
    print(f'Highest MA {LONG_MA} angle: {max_value}')

    # Sort and print top 10 minimum stocks
    sorted_stocks_min = sorted(stocks_dict_min.items(), key=lambda x: x[1])
    min_stocks = sorted_stocks_min[:4]

    for stock, value in min_stocks:
        print(f"Value: {value:.4f} | Stock: {stock.strip()}")

    print('---------------------------------------------------')

    # Sort and print top 10 maximum stocks
    sorted_stocks_max = sorted(stocks_dict_max.items(), key=lambda x: x[1], reverse=True)
    max_stocks = sorted_stocks_max[:4]

    for stock, value in max_stocks:
        print(f"Value: {value:.4f} | Stock: {stock.strip()}")

    # Measure the end time
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time:.4f} seconds")

if __name__ == "__main__":
    main()