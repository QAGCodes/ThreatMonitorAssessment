from selenium import webdriver
import csv
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# Set up Selenium webdriver
driver = webdriver.Chrome()
driver.get("https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population")

# Wait for the page to load and until a table is found in the HTML
wait = WebDriverWait(driver, timeout=10)
table = wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))

# Needed to fix the format on the table. As of writing, india and china have a merged cell that messes up the table format when parsing.
elements = driver.find_elements(By.CLASS_NAME, 'headerSort')
elements[0].click()

# Get the page source
page_source = driver.page_source

# Close the webdriver
driver.quit()

# Parse the HTML
soup = BeautifulSoup(page_source, 'html.parser')

# Find the table containing the information
table = soup.find('table', class_='wikitable')


# Extract the information and store it in a CSV file
with open('population.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:
    writer = csv.writer(csvfile)
    
    # Write table headers
    headers = [header.get_text(strip=True) for header in table.find_all('th')[:-2]]
    headers[0] = 'Number Rank'
    headers[3] = '% of World Population'
    writer.writerow(headers)
    
    # Write table data
    for row in table.find_all('tr'):
        data = [cell.get_text(strip=True) for cell in row.find_all('td')[:-2]]
        if data:  # Check if the row contains any 'td' elements
            writer.writerow(data)