import type { NextFunction, Request, Response } from "express";
import { restaurantKeyById } from "../utils/keys.js";
import { initializeRedisClient } from "../utils/redis.js";
import { errorResponse } from "../utils/responses.js";

export const checkRestaurantExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return errorResponse(res, 400, "Restaurant ID is required");
  }

  const redisClient = await initializeRedisClient();
  const restaurantKey = restaurantKeyById(restaurantId);

  const exists = await redisClient.exists(restaurantKey);

  if (!exists) {
    return errorResponse(res, 404, "Restaurant not found");
  }

  next();
};
