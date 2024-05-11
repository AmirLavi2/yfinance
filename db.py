import mysql.connector

# Connect to the database
db_connection = mysql.connector.connect(
  host="127.0.0.1",
  user="amir",
  passwd="5590",
  database="stocks"
)

# Check if the connection is successful
if db_connection.is_connected():
  print("Connected to MySQL database")

# Perform database operations here

# Close the connection
db_connection.close()
