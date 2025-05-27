export function getKeyName(...args: string[]) {
  return `learning:${args.join(":")}`;
}

export const restaurantKeyById = (id: string) => getKeyName("restaurants", id);

export const reviewKeyById = (id: string) => getKeyName("reviews", id);
export const reviewDetailsKeyById = (id: string) =>
  getKeyName("review-details", id);
