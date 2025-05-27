import { Router, type Request } from "express";
import { nanoid } from "nanoid";
import { checkRestaurantExists } from "../middlewares/checkRestaurantExistsInRedis.js";
import { validate } from "../middlewares/validate.js";
import { RestaurantSchema, type Restaurant } from "../schemas/restaurant.js";
import { ReviewSchema, type Review } from "../schemas/review.js";
import {
  restaurantKeyById,
  reviewDetailsKeyById,
  reviewKeyById,
} from "../utils/keys.js";
import { initializeRedisClient } from "../utils/redis.js";
import { errorResponse, successResponse } from "../utils/responses.js";

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

  await redisClient.hSet(restaurantKey, hashData); // Use Redis Hashing to store the restaurant details

  return successResponse(res, hashData, "Created new restaurant");
});

router.post(
  "/:restaurantId/reviews",
  validate(ReviewSchema),
  async (req: Request<{ restaurantId: string }>, res) => {
    const { restaurantId } = req.params;
    const data = req.body as Review;

    const redisClient = await initializeRedisClient();

    const reviewId = nanoid();
    const reviewKey = reviewKeyById(restaurantId);
    const reviewDetailsKey = reviewDetailsKeyById(reviewId);
    const reviewData = {
      id: reviewId,
      ...data,
      timestamp: Date.now(),
      restaurantId,
    };

    await Promise.all([
      redisClient.lPush(reviewKey, reviewId), // Use Redis Linked List to store the review id
      redisClient.hSet(reviewDetailsKey, reviewData), // Use Redis Hashing to store the review details
    ]);

    return successResponse(res, reviewData, "Review created successfully");
  }
);

router.get(
  "/:restaurantId/reviews",
  checkRestaurantExists,
  async (req: Request<{ restaurantId: string }>, res) => {
    const { restaurantId } = req.params;

    const { page = 1, limit = 10 } = req.query;

    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit) - 1;

    const redisClient = await initializeRedisClient();
    const reviewKey = reviewKeyById(restaurantId);

    const reviewIds = await redisClient.lRange(reviewKey, start, end); // Get the review ids from the linked list

    const reviews = await Promise.all(
      reviewIds.map(async (reviewId) => {
        const reviewDetailsKey = reviewDetailsKeyById(reviewId);
        const reviewDetails = await redisClient.hGetAll(reviewDetailsKey);
        return reviewDetails;
      })
    );

    return successResponse(res, reviews, "Reviews fetched successfully");
  }
);

router.delete(
  "/:restaurantId/reviews/:reviewId",
  checkRestaurantExists,
  async (req: Request<{ restaurantId: string; reviewId: string }>, res) => {
    const { restaurantId, reviewId } = req.params;

    const redisClient = await initializeRedisClient();

    const reviewKey = reviewKeyById(restaurantId);
    const reviewDetailsKey = reviewDetailsKeyById(reviewId);

    const [removedFromList, deletedReview] = await Promise.all([
      redisClient.lRem(reviewKey, 0, reviewId), // 0 will remove all the occurences of the reviewId from the linked list. 1 will remove the first occurence. -1 will remove the last occurence.
      redisClient.del(reviewDetailsKey),
    ]);

    if (removedFromList === 0 && deletedReview === 0) {
      return errorResponse(res, 404, "Review not found");
    }

    return successResponse(res, deletedReview, "Review deleted successfully");
  }
);

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
