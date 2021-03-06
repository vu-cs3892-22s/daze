import psycopg2
from datetime import date
from dotenv import load_dotenv
import os
import json

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
cursor.execute('''DROP TABLE IF EXISTS "DiningHallInformation"''')

# Create the table if it doesn't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS "DiningHallInformation" ( "name" text NOT NULL, "location" numeric[] NOT NULL, "throughput" integer NOT NULL, "type" text NOT NULL, "imageURL" text NOT NULL, "schedule" json, CONSTRAINT "Dininghall_pkey" PRIMARY KEY ("name") )
''')
    
# Insert data
dining_hall_names = [
  '2301_Bowls',
  '2301_Smoothies',
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

# in seconds
dining_hall_throughputs = {
    '2301_Bowls': 67,
    '2301_Smoothies': 59,
    'Commons': 2,
    'EBI': 3,
    'Kissam': 4,
    'McTyeire': 5,
    'Rand_Bowls': 33,
    'Rand_Randwich': 37,
    'Rand_Fresh_Mex': 26,
    'Rand_Mongolian': 75,
    'Rand_Chicken_Shack': 23,
    'Zeppos': 11,
    'Alumni': 12,
    'Grins': 13,
    'Holy_Smokes': 14,
    'Local_Java': 15,
    'Suzies_Blair': 16,
    'Suzies_FGH': 17,
    'Suzies_MRB': 18,
    'Food_For_Thought': 19
}

dining_hall_locations = {
  '2301_Bowls': [36.1465882, -86.8035787],
  '2301_Smoothies': [36.1465882, -86.8035787],
  'Commons': [36.1418863, -86.7971635],
  'EBI': [36.1486501, -86.8037112],
  'Kissam': [36.1493254, -86.8018191],
  'McTyeire': [36.1437784, -86.8032918],
  'Rand_Bowls': [36.1464751, -86.8033662],
  'Rand_Randwich': [36.1464751, -86.8033662],
  'Rand_Fresh_Mex': [36.1464751, -86.8033662],
  'Rand_Mongolian': [36.1464751, -86.8033662],
  'Rand_Chicken_Shack': [36.1464751, -86.8033662],
  'Zeppos': [36.1468383, -86.807612],
  'Alumni': [36.1479339, -86.803365],
  'Grins': [36.144731, -86.806367],
  'Holy_Smokes': [36.144634, -86.8040498],
  'Local_Java': [36.1462604, -86.8037347],
  'Suzies_Blair': [36.138448, -86.805293],
  'Suzies_FGH': [36.1445184, -86.8036674],
  'Suzies_MRB': [36.1445865, -86.8005806],
  'Food_For_Thought': [36.1453047, -86.8008198]
}

dining_hall_images = {
  '2301_Bowls': 'https://i.ibb.co/p4kMnkZ/2301.png',
  '2301_Smoothies':
    'https://marquemedical.com/wp-content/uploads/2017/09/61783418_l.jpg',
  'Commons': 'https://i.ibb.co/y54yDbs/Commons.jpg',
  'EBI': 'https://www.simplyrecipes.com/thmb/NOwXpq1nenarGiJnOTV7o5Oe_Aw=/1777x1333/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__04__Beef-Pho-LEAD-2-afc6b6a9144947fb9d72070d7ea8c95c.jpg',
  'Kissam':
    'https://images.unsplash.com/photo-1631311695255-8dde6bf96cb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhaW4lMjBib3dsfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
  'McTyeire':
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3474&q=80',
  'Rand_Bowls':
    'https://cdn.vanderbilt.edu/vu-web/insidedores-wpcontent/20190412154412/IMG_5192-488x650.jpg',
  'Rand_Randwich':
    'https://simply-delicious-food.com/wp-content/uploads/2020/07/Easy-salad-sandwiches-with-herb-mayo-5.jpg',
  'Rand_Fresh_Mex':
    'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/9/6/FNM_100119-Tex-Mex-Chicken-Salad-Bowl_s4x3.jpg.rend.hgtvcom.616.462.suffix/1567792788244.jpeg',
  'Rand_Mongolian':
    'https://crazybowlsandwraps.com/wp-content/uploads/2019/09/stir-fry-bowl-edited.jpg',
  'Rand_Chicken_Shack':
    'https://goldenfingers.us/wp-content/uploads/2020/03/Crispy_Chicken_Sandwich.jpg',
  'Zeppos':
    'https://i0.wp.com/bucketlistjourney.net/wp-content/uploads/2016/06/Gyros-RF-2-2.jpg',
  'Alumni': 'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  'Grins': 'https://i.ibb.co/6bS28bP/grins.jpg',
  'Holy_Smokes':
    'https://vanderbilthustler.com/wp-content/uploads/2019/10/AryehsKitchen20180830EG-900x675.jpg',
  'Local_Java':
    'https://www.godairyfree.org/wp-content/uploads/2018/10/Pumpkin-Spice-Latte-online-vert5.jpg',
  'Suzies_Blair':
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  'Suzies_FGH':
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  'Suzies_MRB':
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  'Food_For_Thought':
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg'
}

dining_hall_types = {
  '2301_Bowls': 'Residential Dining Hall',
  '2301_Smoothies': 'Residential Dining Hall',
  'Commons': 'Residential Dining Hall',
  'EBI': 'Residential Dining Hall',
  'Kissam': 'Residential Dining Hall',
  'McTyeire': 'Residential Dining Hall',
  'Rand_Bowls': 'Residential Dining Hall',
  'Rand_Randwich': 'Residential Dining Hall',
  'Rand_Fresh_Mex': 'Residential Dining Hall',
  'Rand_Mongolian': 'Residential Dining Hall',
  'Rand_Chicken_Shack': 'Residential Dining Hall',
  'Zeppos': 'Residential Dining Hall',
  'Alumni': 'Cafe',
  'Grins': 'Cafe',
  'Holy_Smokes': 'Cafe',
  'Local_Java': 'Cafe',
  'Suzies_Blair': 'Cafe',
  'Suzies_FGH': 'Cafe',
  'Suzies_MRB': 'Cafe',
  'Food_For_Thought': 'Cafe'
}

_2301Hours = {
  'Monday': [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  'Tuesday': [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  'Wednesday': [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  'Thursday': [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  'Friday': [[7, 10], [11, 15], []],
  'Saturday': [[], [], []],
  'Sunday': [[], [], [16.5, 20]]
}

randHours = {
  'Monday': [[7, 11], [11, 15], []],
  'Tuesday': [[7, 11], [11, 15], []],
  'Wednesday': [[7, 11], [11, 15], []],
  'Thursday': [[7, 11], [11, 15], []],
  'Friday': [[7, 11], [11, 15], []],
  'Saturday': [[], [], []],
  'Sunday': [[], [], []]
}

suziesHours = {
  'Monday': [[8, 11], [11, 14.5], []],
  'Tuesday': [[8, 11], [11, 14.5], []],
  'Wednesday': [[8, 11], [11, 14.5], []],
  'Thursday': [[8, 11], [11, 14.5], []],
  'Friday': [[8, 11], [11, 14.5], []],
  'Saturday': [[], [], []],
  'Sunday': [[], [], []]
}

commonsKissamHours = {
  'Monday': [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  'Tuesday': [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  'Wednesday': [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  'Thursday': [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  'Friday': [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  'Saturday': [
    [9, 11],
    [11, 14],
    [16.5, 20]
  ],
  'Sunday': [
    [9, 11],
    [11, 14],
    [16.5, 20]
  ]
}

ebiZepposHours = {
  'Monday': [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  'Tuesday': [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  'Wednesday': [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  'Thursday': [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  'Friday': [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  'Saturday': [
    [9, 11],
    [11, 14],
    [16.5, 19.5]
  ],
  'Sunday': [
    [9, 11],
    [11, 14],
    [16.5, 19.5]
  ]
}

dining_hall_schedules = {
  '2301_Bowls': _2301Hours,
  '2301_Smoothies': _2301Hours,
  'Commons': commonsKissamHours,
  'EBI': ebiZepposHours,
  'Kissam': commonsKissamHours,
  'McTyeire': {
    'Monday': [[], [], [17.75, 19]],
    'Tuesday': [[], [], [17.75, 19]],
    'Wednesday': [[], [], [17.75, 19]],
    'Thursday': [[], [], [17.75, 19]],
    'Friday': [[], [], []],
    'Saturday': [[], [], []],
    'Sunday': [[], [], []]
  },
  'Rand_Bowls': randHours,
  'Rand_Randwich': randHours,
  'Rand_Fresh_Mex': randHours,
  'Rand_Mongolian': randHours,
  'Rand_Chicken_Shack': randHours,
  'Zeppos': ebiZepposHours,
  'Alumni': {
    'Monday': [[], [11, 14], [14, 16]],
    'Tuesday': [[], [11, 14], [14, 16]],
    'Wednesday': [[], [11, 14], [14, 16]],
    'Thursday': [[], [11, 14], [14, 16]],
    'Friday': [[], [11, 14], [14, 16]],
    'Saturday': [[], [], []],
    'Sunday': [[], [], []]
  },
  'Grins': {
    'Monday': [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    'Tuesday': [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    'Wednesday': [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    'Thursday': [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    'Friday': [[7, 11], [11, 14], []],
    'Saturday': [[], [], []],
    'Sunday': [[], [], []]
  },
  'Holy_Smokes': {
    'Monday': [[], [12, 13.5], [17, 19.5]],
    'Tuesday': [[], [12, 13.5], [17, 19.5]],
    'Wednesday': [[], [12, 13.5], [17, 19.5]],
    'Thursday': [[], [12, 13.5], [17, 19.5]],
    'Friday': [[], [], []],
    'Saturday': [[], [], []],
    'Sunday': [[], [12, 14], []]
  },
  'Local_Java': {
    'Monday': [[7, 10], [10, 13.5], []],
    'Tuesday': [[7, 10], [10, 13.5], []],
    'Wednesday': [[7, 10], [10, 13.5], []],
    'Thursday': [[7, 10], [10, 13.5], []],
    'Friday': [[7, 10], [10, 13.5], []],
    'Saturday': [[], [], []],
    'Sunday': [[], [], []]
  },
  'Suzies_Blair': suziesHours,
  'Suzies_FGH': suziesHours,
  'Suzies_MRB': {
    'Monday': [[7.5, 12.5], [12.5, 16.5], []],
    'Tuesday': [[7.5, 12.5], [12.5, 16.5], []],
    'Wednesday': [[7.5, 12.5], [12.5, 16.5], []],
    'Thursday': [[7.5, 12.5], [12.5, 16.5], []],
    'Friday': [[7.5, 12.5], [12.5, 16.5], []],
    'Saturday': [[], [], []],
    'Sunday': [[], [], []]
  },
  'Food_For_Thought': {
    'Monday': [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    'Tuesday': [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    'Wednesday': [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    'Thursday': [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    'Friday': [[8, 12], [12, 15], []],
    'Saturday': [[], [], []],
    'Sunday': [[], [], []]
  }
}

for dining_hall_name in dining_hall_names:
    cursor.execute('INSERT INTO "DiningHallInformation" ("name", "location", "throughput", "type", "imageURL", "schedule") VALUES(%s, %s, %s, %s, %s, %s)',
                   (dining_hall_name, dining_hall_locations[dining_hall_name], dining_hall_throughputs[dining_hall_name], dining_hall_types[dining_hall_name], dining_hall_images[dining_hall_name], json.dumps(dining_hall_schedules[dining_hall_name])))

cursor.execute('''SELECT * FROM "DiningHallInformation"''')
result = cursor.fetchall()

# verify it worked
print(result)

# close the connections
cursor.close()
conn.close()