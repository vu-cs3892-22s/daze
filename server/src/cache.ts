import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL
});

// TODO: Export redis functions here
