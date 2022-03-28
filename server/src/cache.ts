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
  let results: any = {};
  await client.select(db);
  for (const diningHallName of diningHallNames) {
    const result = await client.lRange(diningHallName, 0, -1);
    results[diningHallName] = result;
  }

  return results;
};
