import { client } from './init_redis';

interface DataBody {
  vanderbiltEmail: string;
  diningHallName: string;
  lineLength: string;
  timeStamp: string;
}

const diningHallNames = [
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
];

const diningHallLocations: { [key: string]: number[] } = {
  '2301_Bowls': [36.1465882, -86.8035787],
  '2301_Smoothies': [36.1465882, -86.8035787],
  Commons: [36.1418863, -86.7971635],
  EBI: [36.1486501, -86.8037112],
  Kissam: [36.1493254, -86.8018191],
  McTyeire: [36.1437784, -86.8032918],
  Rand_Bowls: [36.1464751, -86.8033662],
  Rand_Randwich: [36.1464751, -86.8033662],
  Rand_Fresh_Mex: [36.1464751, -86.8033662],
  Rand_Mongolian: [36.1464751, -86.8033662],
  Rand_Chicken_Shack: [36.1464751, -86.8033662],
  Zeppos: [36.1468383, -86.807612],
  Alumni: [36.1479339, -86.803365],
  Grins: [36.144731, -86.806367],
  Holy_Smokes: [36.144634, -86.8040498],
  Local_Java: [36.1462604, -86.8037347],
  Suzies_Blair: [36.138448, -86.805293],
  Suzies_FGH: [36.1445184, -86.8036674],
  Suzies_MRB: [36.1445865, -86.8005806],
  Food_For_Thought: [36.1453047, -86.8008198]
};

const diningHallImages: { [key: string]: string } = {
  '2301_Bowls': 'https://i.ibb.co/p4kMnkZ/2301.png',
  '2301_Smoothies':
    'https://marquemedical.com/wp-content/uploads/2017/09/61783418_l.jpg',
  Commons: 'https://i.ibb.co/y54yDbs/Commons.jpg',
  EBI: 'https://www.simplyrecipes.com/thmb/NOwXpq1nenarGiJnOTV7o5Oe_Aw=/1777x1333/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__04__Beef-Pho-LEAD-2-afc6b6a9144947fb9d72070d7ea8c95c.jpg',
  Kissam:
    'https://images.unsplash.com/photo-1631311695255-8dde6bf96cb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhaW4lMjBib3dsfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
  McTyeire:
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3474&q=80',
  Rand_Bowls:
    'https://cdn.vanderbilt.edu/vu-web/insidedores-wpcontent/20190412154412/IMG_5192-488x650.jpg',
  Rand_Randwich:
    'https://simply-delicious-food.com/wp-content/uploads/2020/07/Easy-salad-sandwiches-with-herb-mayo-5.jpg',
  Rand_Fresh_Mex:
    'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/9/6/FNM_100119-Tex-Mex-Chicken-Salad-Bowl_s4x3.jpg.rend.hgtvcom.616.462.suffix/1567792788244.jpeg',
  Rand_Mongolian:
    'https://crazybowlsandwraps.com/wp-content/uploads/2019/09/stir-fry-bowl-edited.jpg',
  Rand_Chicken_Shack:
    'https://goldenfingers.us/wp-content/uploads/2020/03/Crispy_Chicken_Sandwich.jpg',
  Zeppos:
    'https://i0.wp.com/bucketlistjourney.net/wp-content/uploads/2016/06/Gyros-RF-2-2.jpg',
  Alumni: 'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  Grins: 'https://i.ibb.co/6bS28bP/grins.jpg',
  Holy_Smokes:
    'https://vanderbilthustler.com/wp-content/uploads/2019/10/AryehsKitchen20180830EG-900x675.jpg',
  Local_Java:
    'https://www.godairyfree.org/wp-content/uploads/2018/10/Pumpkin-Spice-Latte-online-vert5.jpg',
  Suzies_Blair:
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  Suzies_FGH:
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  Suzies_MRB:
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg',
  Food_For_Thought:
    'https://farm4.staticflickr.com/3907/15390517111_10e4d037dd_b.jpg'
};

const diningHallTypes: { [key: string]: string } = {
  2301: 'Residential Dining Hall',
  Commons: 'Residential Dining Hall',
  EBI: 'Residential Dining Hall',
  Kissam: 'Residential Dining Hall',
  McTyeire: 'Residential Dining Hall',
  Rand_Bowls: 'Residential Dining Hall',
  Rand_Randwich: 'Residential Dining Hall',
  Rand_Fresh_Mex: 'Residential Dining Hall',
  Rand_Mongolian: 'Residential Dining Hall',
  Rand_Chicken_Shack: 'Residential Dining Hall',
  Zeppos: 'Residential Dining Hall',
  Alumni: 'Cafe',
  Grins: 'Cafe',
  Holy_Smokes: 'Cafe',
  Local_Java: 'Cafe',
  Suzies_Blair: 'Cafe',
  Suzies_FGH: 'Cafe',
  Suzies_MRB: 'Cafe',
  Food_For_Thought: 'Cafe'
};

export const insertData = async (data: DataBody, db: number) => {
  await client.select(db);
  const diningHallName = data.diningHallName;
  await client.rPush(diningHallName, JSON.stringify(data));
};

export const getDataForDiningHall = async (
  diningHallName: string,
  db: number
) => {
  await client.select(db);
  const result = await client.lRange(diningHallName, 0, -1);
  return result;
};

export const getDataForDiningHalls = async (db: number) => {
  const results: any = {};
  await client.select(db);
  for (const diningHallName of diningHallNames) {
    const result = await client.lRange(diningHallName, 0, -1);
    const long = diningHallLocations[diningHallName][0];
    const lat = diningHallLocations[diningHallName][1];
    const type = diningHallTypes[diningHallName];
    const image = diningHallImages[diningHallName];
    const name = diningHallName;
    results[diningHallName] = {
      lineLength: result,
      longitude: long,
      latitude: lat,
      name: name,
      type: type,
      image: image
    };
  }

  return results;
};
