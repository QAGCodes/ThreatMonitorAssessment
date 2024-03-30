# Prerequisites

In order for the code to work properly, Selenium must be set up properly with chromedriver. Please follow the tutorial on their official website to setup the driver:
https://chromedriver.chromium.org/getting-started

While Selenium is not strictly needed to achieve this task, it helps because an action must be taken on the web page in order to format the table properly when written into a CSV file (see code comments for details)

# Dependencies

The following dependencies are needed:
`pip install selenium beautifulsoup4`

# How To Run

You can run `python3 index.py` and your output should be in the `population.csv` file.

# Note

When opening the csv file in Excel, the population data might appear as `###...`. Expand the cell in order for the number to be visible.
