import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { RestaurantSchema, type Restaurant } from "../schemas/restaurant.js";
import { initializeRedisClient } from "../utils/redis.js";

const router = Router();

// We use express chaining to validate the request body
router.post("/", validate(RestaurantSchema), async (req, res) => {
  // Now the req.body is validated, so we can assert it to the type
  const data = req.body as Restaurant;

  const redisClient = await initializeRedisClient();

  res.send("Hello World");
});

export default router;
