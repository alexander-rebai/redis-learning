export function getKeyName(...args: string[]) {
  return `learning:${args.join(":")}`;
}

export const restaurantKeyById = (id: string) => getKeyName("restaurants", id);

export const reviewKeyById = (id: string) => getKeyName("reviews", id);
export const reviewDetailsKeyById = (id: string) =>
  getKeyName("review-details", id);

export const cuisinesKey = getKeyName("cuisines");
export const cuisineKey = (name: string) => getKeyName("cuisine", name);
export const restaurantCusinesKeyByRestaurantId = (id: string) =>
  getKeyName("restaurant-cusines", id);
