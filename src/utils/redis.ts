import { createClient, type RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

export const initializeRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient();

    redisClient.on("error", (err) => {
      console.error("Redis error", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis connected");
    });

    await redisClient.connect();
  }

  return redisClient;
};
