import matplotlib.pyplot as plt

# First set of data
data = [('NVDA', 1.0036431463433009), ('LLY', 1.0034382363518601), ('META', 1.0033051117497582), ('GOOG', 1.0020175390594301), ('GOOGL', 1.0019861471552916)]

# Second set of data
data2 = [('ABC', 1.5036431463433009), ('EFG', 1.5034382363518601), ('HIJ', 1.5033051117497582), ('KLM', 1.5020175390594301), ('OPQ', 1.5019861471552916)]

# Third set of data
data3 = [('fghf', 1.3036431463433009), ('hgj', 1.3034382363518601), ('yk', 1.2033051117497582), ('bngh', 1.2020175390594301), ('ereb', 1.3019861471552916)]

# Extract stock symbols and values for all data sets
symbols, values = zip(*data)
symbols2, values2 = zip(*data2)
symbols3, values3 = zip(*data3)

# Calculate the minimum value for all data sets
min_value = min(min(values), min(values2), min(values3))

# Create a bar chart
plt.figure(figsize=(12, 6))
plt.bar(symbols, values, label='Data Set 1')
plt.bar(symbols2, values2, label='Data Set 2', alpha=0.7)
plt.bar(symbols3, values3, label='Data Set 3', alpha=0.7)
plt.xlabel('Stock Symbol')
plt.ylabel('Numerical Value')
plt.title('Stock Data')

# Set the Y-axis lower limit to the minimum value minus a small margin
plt.ylim(min_value - 0.1, max(max(values), max(values2), max(values3)) + 0.1)

# Add a legend to differentiate between the data sets
plt.legend()

plt.show()
