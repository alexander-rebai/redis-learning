import { Router } from "express";
import { cuisineKey, cuisinesKey, restaurantKeyById } from "../utils/keys.js";
import { initializeRedisClient } from "../utils/redis.js";
import { successResponse } from "../utils/responses.js";

const router = Router();

router.get("/", async (req, res) => {
  const redisClient = await initializeRedisClient();

  const cuisines = await redisClient.sMembers(cuisinesKey);

  return successResponse(res, cuisines);
});

router.get("/:cuisine", async (req, res, next) => {
  const { cuisine } = req.params;

  const redisClient = await initializeRedisClient();
  const restaurantIds = await redisClient.sMembers(cuisineKey(cuisine));

  const restaurants = await Promise.all(
    restaurantIds.map((id) => {
      const restaurantKey = restaurantKeyById(id);
      const restaurantName = redisClient.hGet(restaurantKey, "name");
      return restaurantName;
    })
  );

  return successResponse(res, restaurants);
});

export default router;
