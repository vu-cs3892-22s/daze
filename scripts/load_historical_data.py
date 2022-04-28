import psycopg2
from datetime import date
from dotenv import load_dotenv
import os
import json
import pandas as pd

load_dotenv()

POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_DATABASE = os.getenv('POSTGRES_DATABASE')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')

conn = psycopg2.connect(
    host=POSTGRES_HOST,
    database=POSTGRES_DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD)

conn.autocommit = True

cursor = conn.cursor()

# Drop the table if it exists
cursor.execute('''DROP TABLE IF EXISTS "HistoricalData"''')

# Create the table if it doesn't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS "HistoricalData" ( "name" text NOT NULL, "data" json, CONSTRAINT "Historical_pkey" PRIMARY KEY ("name") )
''')

df = pd.read_csv('daze_historical_data.csv')

dining_hall_names = [
    'Rand', '2301', 'Zeppos', 'Grins', 'EBI', 'Commons', 'Suzies_Blair', 'Suzies_FGH',
    'Suzies_MRB', 'Food_For_Thought', 'Alumni', 'Holy_Smokes'
]

n = 4

for dining_hall_name in dining_hall_names:
    averages = [sum(df[dining_hall_name][i:i+n])//n for i in range(0,len(df[dining_hall_name]),n)]
    current_historical_data = {}
    for i in range(len(averages)):
        current_historical_data[i + 7] = averages[i]


    # historical_data[dining_hall_name] = current_historical_data
    cursor.execute('INSERT INTO "HistoricalData" ("name", "data" ) VALUES(%s, %s)',
                   (dining_hall_name, json.dumps(current_historical_data)))

cursor.execute('SELECT * FROM "HistoricalData"')
rows = cursor.fetchall()

cursor.close()
conn.close()
print(rows)
