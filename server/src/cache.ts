import * as redis from 'redis';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../../.env`
});

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

client.on('error', (err) => {
  console.log('Error ' + err);
});

export const insertData = async (data: any, db: number) => {
  await client.connect();
  await client.select(db);
  const diningHallName = data.diningHallName;
  await client.rPush(diningHallName, JSON.stringify(data));
  await client.disconnect();
};

export const getDataForDiningHall = async (
  diningHallName: string,
  db: number
) => {
  await client.connect();
  await client.select(db);
  const result = await client.lRange(diningHallName, 0, -1);
  await client.disconnect();
  return result;
};
