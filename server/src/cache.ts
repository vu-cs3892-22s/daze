import { client } from './init_redis';

export const insertData = async (data: any, db: number) => {
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
