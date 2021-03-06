import * as redis from 'redis';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../../.env`
});

export const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: false,
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    await client.connect();
  } catch (e) {
    console.log('Redis failed to connect');
  }
})();

client.on('connect', () => {
  console.log('Client connected to redis');
});

client.on('ready', () => {
  console.log('Client connected to redis and ready to use.');
});

client.on('error', (err: unknown) => {
  console.log(err);
});

client.on('end', () => {
  console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
  client.quit();
});
