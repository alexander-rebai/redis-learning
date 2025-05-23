import { Router, type Request } from "express";
import { nanoid } from "nanoid";
import { checkRestaurantExists } from "../middlewares/checkRestaurantExistsInRedis.js";
import { validate } from "../middlewares/validate.js";
import { RestaurantSchema, type Restaurant } from "../schemas/restaurant.js";
import { restaurantKeyById } from "../utils/keys.js";
import { initializeRedisClient } from "../utils/redis.js";
import { successResponse } from "../utils/responses.js";

const router = Router();

// We use express chaining to validate the request body
router.post("/", validate(RestaurantSchema), async (req, res) => {
  // Now the req.body is validated, so we can assert it to the type
  const data = req.body as Restaurant;

  const redisClient = await initializeRedisClient();

  const id = nanoid();
  const restaurantKey = restaurantKeyById(id);
  const hashData = {
    id,
    name: data.name,
    location: data.location,
  };

  await redisClient.hSet(restaurantKey, hashData);

  return successResponse(res, hashData, "Created new restaurant");
});

router.get(
  "/:restaurantId",
  checkRestaurantExists,
  async (req: Request<{ restaurantId: string }>, res) => {
    const { restaurantId } = req.params;

    const redisClient = await initializeRedisClient();
    const restaurantKey = restaurantKeyById(restaurantId);

    const [viewcount, restaurant] = await Promise.all([
      redisClient.hIncrBy(restaurantKey, "viewCount", 1),
      redisClient.hGetAll(restaurantKey),
    ]);

    return successResponse(res, restaurant, "Restaurant fetched successfully");
  }
);

export default router;
