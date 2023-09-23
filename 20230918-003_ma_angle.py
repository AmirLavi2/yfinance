# TODO: advance: build DB
# TODO: split code - 1: gets API data and write to the DB
# TODO: split code - 2: read data and calculate result

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import yfinance as yf
import time
import datetime
import matplotlib.ticker as mtick

# constants
MA_LONG = 150 #150
MA_SHORT = 5 #20
PERIOD = '1d'
START_DATE = '2023-02-15'
END_DATE = datetime.datetime.now()
INTERVAL = '1d'
output = {}
top_5_ma_angle_long = []
top_5_ma_angle_short = []
bottom_5_closest_ma_long = []
FILE_NAME = 'tickers_200B.txt'
# FILE_NAME = 'tickers_2B-10B.txt'

# functions
def get_stock_data(stock, startdate, enddate, period, interval):
    try:
        yf.pdr_override()
        df = yf.download(tickers=stock, start=startdate, end=enddate, interval=interval, period=period, progress=False)
        df.reset_index(inplace=True)
        df['date'] = df['Date'].dt.date
        return df
    except Exception as e:
        print(f"An error occurred while fetching data for {stock}: {str(e)}")

def moving_average_angle(close_price, ma):
    ma_series = close_price.rolling(int(ma)).mean()
    return ma_series.iloc[-1] / ma_series.iloc[-2]

def closest_to_moving_average(close_price, ma):
    ma_series = close_price.rolling(int(ma)).mean()
    ma_value = ma_series.iloc[-1]

    return close_price.iloc[-1] / ma_value

def create_output_dictionary(close_price, stock_name):
    ma_angle_long = moving_average_angle(close_price, MA_LONG)
    ma_angle_short = moving_average_angle(close_price, MA_SHORT)
    closest_ma_long = closest_to_moving_average(close_price, MA_LONG)

    if stock_name not in output:
        output[stock_name] = {}

    output[stock_name]['close_price'] = close_price.iloc[-1]

    if ma_angle_long > 1:
        output[stock_name]['ma_angle_long'] = ma_angle_long
    if ma_angle_short > 1:
        output[stock_name]['ma_angle_short'] = ma_angle_short
    if closest_ma_long > 1:
        output[stock_name]['closest_ma_long'] = closest_ma_long

def find_top_stocks():

    global top_5_ma_angle_long
    global top_5_ma_angle_short
    global bottom_5_closest_ma_long

    # Iterate through the dictionary
    for stock_symbol, data in output.items():
        if 'ma_angle_long' in data:  # Check if the key 'ma_angle_long' exists
            ma_angle_long = data['ma_angle_long']
            top_5_ma_angle_long.append((stock_symbol, ma_angle_long))
        
        if 'ma_angle_short' in data:  # Check if the key 'ma_angle_short' exists
            ma_angle_short = data['ma_angle_short']
            top_5_ma_angle_short.append((stock_symbol, ma_angle_short))
        
        if 'closest_ma_long' in data:  # Check if the key 'closest_ma_long' exists
            closest_ma_long = data['closest_ma_long']
            bottom_5_closest_ma_long.append((stock_symbol, closest_ma_long))

    # Sort the lists based on their respective attributes
    top_5_ma_angle_short.sort(key=lambda x: x[1], reverse=True)
    top_5_ma_angle_long.sort(key=lambda x: x[1], reverse=True)
    bottom_5_closest_ma_long.sort(key=lambda x: x[1])

    # Take the top 5 and bottom 5 entries for each attribute
    top_5_ma_angle_long = top_5_ma_angle_long[:5]
    top_5_ma_angle_short = top_5_ma_angle_short[:5]
    bottom_5_closest_ma_long = bottom_5_closest_ma_long[:5]

def print_output():

    print("\nTop 5 Highest 'ma_angle_long':")
    for i, (stock_symbol, ma_angle_long) in enumerate(top_5_ma_angle_long):
        print(f"{i + 1}. Stock: {stock_symbol}, MA Angle long: {ma_angle_long}")

    print("\nTop 5 Highest 'ma_angle_short':")
    for i, (stock_symbol, ma_angle_short) in enumerate(top_5_ma_angle_short):
        print(f"{i + 1}. Stock: {stock_symbol}, MA Angle short: {ma_angle_short}")

    print("\n5 Lowest 'closest_ma_long':")
    for i, (stock_symbol, closest_ma_long) in enumerate(bottom_5_closest_ma_long):
        print(f"{i + 1}. Stock: {stock_symbol}, Closest MA long: {closest_ma_long}")


# Function to plot the close prices of the top 5 stocks with the highest 'ma_angle_long' as percentages
def plot_top_5_ma_angle_long():
    import matplotlib.pyplot as plt

    # Get the top 5 stocks with the highest 'ma_angle_long'
    top_5_ma_angle_long_stocks = [stock_symbol for stock_symbol, _ in top_5_ma_angle_long]

    # Fetch the close prices and ma_series for these stocks
    stock_data = yf.download(tickers=top_5_ma_angle_long_stocks, start=START_DATE, end=END_DATE, interval=INTERVAL, period=PERIOD, progress=False)
    
    # Plot the close prices for each stock
    plt.figure(figsize=(12, 6))
    for stock_symbol in top_5_ma_angle_long_stocks:
        ma_series = stock_data['Close'][stock_symbol].rolling(MA_LONG).mean()
        plt.plot(stock_data.index, stock_data['Close'][stock_symbol] / ma_series.iloc[-1] * 100, label=f'{stock_symbol} - MA={ma_series.iloc[-1]:.2f}%')

    # Add a horizontal line for the MA value on the Y-axis
    for stock_symbol in top_5_ma_angle_long_stocks:
        ma_series = stock_data['Close'][stock_symbol].rolling(MA_LONG).mean()
        plt.axhline(y=100, color='gray', linestyle='--')

    plt.xlabel('Date')
    plt.ylabel('Close Price (%)')
    plt.title('Close Prices of Top 5 Stocks with Highest MA Angle Long (as Percentage of MA)')
    plt.legend(loc='upper left')
    plt.grid(True)

    # Format Y-axis as percentages
    plt.gca().yaxis.set_major_formatter(mtick.PercentFormatter())

    plt.show()




# Function to plot the close prices of the top 5 stocks with the highest 'ma_angle_short' as percentages
def plot_top_5_ma_angle_short():
    import matplotlib.pyplot as plt

    # Get the top 5 stocks with the highest 'ma_angle_short'
    top_5_ma_angle_short_stocks = [stock_symbol for stock_symbol, _ in top_5_ma_angle_short]

    # Fetch the close prices and ma_series for these stocks
    stock_data = yf.download(tickers=top_5_ma_angle_short_stocks, start=START_DATE, end=END_DATE, interval=INTERVAL, period=PERIOD, progress=False)
    
    # Plot the close prices for each stock
    plt.figure(figsize=(12, 6))
    for stock_symbol in top_5_ma_angle_short_stocks:
        ma_series = stock_data['Close'][stock_symbol].rolling(MA_SHORT).mean()
        plt.plot(stock_data.index, stock_data['Close'][stock_symbol] / ma_series.iloc[-1] * 100, label=f'{stock_symbol} - MA={ma_series.iloc[-1]:.2f}%')

    # Add a horizontal line for the MA value on the Y-axis
    for stock_symbol in top_5_ma_angle_short_stocks:
        ma_series = stock_data['Close'][stock_symbol].rolling(MA_SHORT).mean()
        plt.axhline(y=100, color='gray', linestyle='--')

    plt.xlabel('Date')
    plt.ylabel('Close Price (%)')
    plt.title('Close Prices of Top 5 Stocks with Highest MA Angle Short (as Percentage of MA)')
    plt.legend(loc='upper left')
    plt.grid(True)

    # Format Y-axis as percentages
    plt.gca().yaxis.set_major_formatter(mtick.PercentFormatter())

    plt.show()



# Function to plot the close prices of the top 5 stocks with the lowest 'closest_ma_long' as percentages
def plot_bottom_5_closest_ma_long():
    import matplotlib.pyplot as plt

    # Get the top 5 stocks with the lowest 'closest_ma_long'
    bottom_5_closest_ma_long_stocks = [stock_symbol for stock_symbol, _ in bottom_5_closest_ma_long]

    # Fetch the close prices and ma_series for these stocks
    stock_data = yf.download(tickers=bottom_5_closest_ma_long_stocks, start=START_DATE, end=END_DATE, interval=INTERVAL, period=PERIOD, progress=False)
    
    # Plot the close prices for each stock
    plt.figure(figsize=(12, 6))
    for stock_symbol in bottom_5_closest_ma_long_stocks:
        ma_series = stock_data['Close'][stock_symbol].rolling(MA_LONG).mean()
        plt.plot(stock_data.index, stock_data['Close'][stock_symbol] / ma_series.iloc[-1] * 100, label=f'{stock_symbol} - MA={ma_series.iloc[-1]:.2f}%')

    # Add a horizontal line for the MA value on the Y-axis
    for stock_symbol in bottom_5_closest_ma_long_stocks:
        ma_series = stock_data['Close'][stock_symbol].rolling(MA_LONG).mean()
        plt.axhline(y=100, color='gray', linestyle='--')

    plt.xlabel('Date')
    plt.ylabel('Close Price (%)')
    plt.title('Close Prices of Bottom 5 Stocks with Lowest Closest MA Long (as Percentage of MA)')
    plt.legend(loc='upper left')
    plt.grid(True)

    # Format Y-axis as percentages
    plt.gca().yaxis.set_major_formatter(mtick.PercentFormatter())

    plt.show()



def main():
    # Measure the start time
    start_time = time.time()

    # read stock list
    tickers = open(FILE_NAME, 'r')
    lines_ticker = tickers.readlines()
    for line_stock in lines_ticker:
        line_stock = line_stock.strip()
        df = get_stock_data(line_stock, START_DATE, END_DATE, PERIOD, INTERVAL)
        if df is not None:
            create_output_dictionary(df['Close'], line_stock)

    find_top_stocks()
    print_output()
    plot_top_5_ma_angle_long()
    plot_top_5_ma_angle_short()
    plot_bottom_5_closest_ma_long()
    # Measure the end time
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time:.4f} seconds")


if __name__ == "__main__":
    main()