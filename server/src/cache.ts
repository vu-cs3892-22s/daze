import { client } from './init_redis';

interface DataBody {
  vanderbiltEmail: string;
  diningHallName: string;
  lineLength: string;
  timeStamp: string;
}

const diningHallNames = [
  '2301',
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
  2301: [36.1465882, -86.8035787],
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
    results[diningHallName] = {
      length: result,
      longitude: long,
      latitude: lat
    };
  }

  return results;
};
