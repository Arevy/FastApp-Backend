
import Redis from 'ioredis';

const redis = new Redis({
	host: process.env.CACHE_REDIS_HOST || 'localhost', // adresa serverului Redis
	port: process.env.CACHE_REDIS_PORT, // portul pe care rulează Redis
	password: process.env.REDIS_PASSWORD || undefined, 
});

export default redis;
