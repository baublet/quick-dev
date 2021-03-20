import redis from "redis";
import { log } from "../../../common/logger";

declare global {
  module NodeJS {
    interface Global {
      redisClient: redis.RedisClient;
    }
  }
}

function getRedisClient() {
  if (!global.redisClient) {
    global.redisClient = redis.createClient();

    global.redisClient.on("error", function (error) {
      console.error(error);
    });
  }
  return global.redisClient;
}

function clear(key: string) {
  return new Promise<void>((resolve) => {
    global.redisClient.del(key, () => {
      resolve();
    });
  });
}

export const cache = {
  get: <V = any>(key: string) => {
    return new Promise<V | null>((resolve) => {
      getRedisClient().get(key, async (error, value) => {
        if (error) {
          log.error("Error getting redis cache value", {
            message: error.message,
            stack: error.stack,
          });
          throw error;
        }
        try {
          if (!value) {
            return resolve(null);
          }
          resolve(JSON.parse(value));
        } catch (e) {
          log.error("Error parsing redis cache value", {
            message: e.message,
            stack: e.stack,
          });
          throw e;
        }
      });
    });
  },
  set: (key: string, value: any, expireAfter: number = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      getRedisClient().set(key, JSON.stringify(value), "EX", 360, (error) => {
        if (error) {
          log.error("Error setting redis cache value", {
            message: error.message,
            stack: error.stack,
          });
          return reject(error);
        }
        resolve();
      });
    });
  },
};
