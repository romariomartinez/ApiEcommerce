import NodeCache from 'node-cache';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redis: Redis | null = null;

if (redisUrl) {
  redis = new Redis(redisUrl);
}

const memoryCache = new NodeCache({
  stdTTL: 60, // 60 segundos
});

export async function getCache<T>(key: string): Promise<T | null> {
  if (redis) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  return memoryCache.get<T>(key) ?? null;
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl = 60
): Promise<void> {
  if (redis) {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } else {
    memoryCache.set(key, value, ttl);
  }
}

export async function delCache(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
  } else {
    memoryCache.del(key);
  }
}
