import redis
import psycopg2
from datetime import date
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_DATABASE = os.getenv('POSTGRES_DATABASE')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT,
                password=REDIS_PASSWORD,
                ssl=True, ssl_cert_reqs="none", decode_responses=True)

dining_hall_names = [
    '2301',
    '2301_Smoothies',
    '2301_Bowls'
    'Commons',
    'EBI',
    'Kissam',
    'McTyeire',
    'Rand_Bowls',
    'Rand_Randwich',
    'Rand_Fresh_Mex',
    'Rand_Mongolian',
    'Rand_Chicken_Shack',
    'Zeppos',
    'Alumni',
    'Grins',
    'Holy_Smokes',
    'Local_Java',
    'Suzies_Blair',
    'Suzies_FGH',
    'Suzies_MRB',
    'Food_For_Thought'
]

results = {}

# retrieve the data and store it in dictionary
for dining_hall_name in dining_hall_names:
    value = r.lrange(dining_hall_name, 0, -1)
    results[dining_hall_name] = value

# delete all the data in redis
r.flushdb()

conn = psycopg2.connect(
    host=POSTGRES_HOST,
    database=POSTGRES_DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD)

cursor = conn.cursor()

# Create the table if it doesn't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS "DailyData" ( "name" text NOT NULL, "date" date, "dailydata" json[], CONSTRAINT "Daily_pkey" PRIMARY KEY ("name") )
''')

for key in results:
    dining_location = key
    date = date.today()
    daily_data = results[key]
    cursor.execute('INSERT INTO "DailyData" ("name", "date", "dailydata") VALUES(%s, %s, %s::json[])',
                   (dining_location, date, daily_data))

    conn.commit()  # <- We MUST commit to reflect the inserted data

cursor.execute('''SELECT * FROM "DailyData"''')

rows = cursor.fetchall()

cursor.close()
conn.close()

print(rows)