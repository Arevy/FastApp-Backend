import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.CACHE_REDIS_HOST,
  port: process.env.CACHE_REDIS_PORT
});

export default redis;
