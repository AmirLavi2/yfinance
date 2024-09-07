# 1) fetch the stocks from tickers file
# 2) insert result to DB

from my_modules import stock_utils
import configparser
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
import sys
import re
# ----------------------------------------------------------
# Fetch stock tickers from the file
with open('tickers/tickers_from_1B.txt', 'r') as file:
    stocks_tickers = [line.strip() for line in file]

# ----------------------------------------------------------
# Read database configuration from config.ini
config = configparser.ConfigParser()
config.read('config.ini')

# Extract database connection info from the config file
db_config = {
    'host': config['database']['host'],
    'user': config['database']['user'],
    'password': config['database']['password'],
    'database': config['database']['database']
}

# Create a SQLAlchemy engine using the configuration from the .ini file
try:
    engine = create_engine(
        'mysql+mysqlconnector://{user}:{password}@{host}/{database}'.format(**db_config)
    )
    # Test the connection to ensure it's established correctly
    with engine.connect() as conn:
        print("Connection successful. fetching tickers data")
except SQLAlchemyError as e:
    err = str(e)
    match = re.search(r'\d{4} \(\d{5}\): (.*)', err)
    if match:
        err_short = match.group(1)
        print("DB Error: ", err_short)
    else:
        print("DB Error: ", err)

    sys.exit(1)

# ----------------------------------------------------------
# Loop through all tickers, fetch stock data, and insert into the database
for ticker in stocks_tickers:
    stock_data = stock_utils.stock_get(ticker)
    if stock_data is not False:
        try:
            stock_data.to_sql('stocks', con=engine, if_exists='append', index=True)
        except SQLAlchemyError as e:
            err = str(e)
            match = re.search(r'\d{4} \(\d{5}\): (.*)', err)
            if match:
                err_short = match.group(1)
                print(f"Insert '{ticker}' data Error: {err_short}")
            else:
                print(f"Insert '{ticker}' data Error: {err}")
# ----------------------------------------------------------
print("ticker data is now up to date")