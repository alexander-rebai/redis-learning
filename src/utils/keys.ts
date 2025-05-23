export function getKeyName(...args: string[]) {
  return `learning:${args.join(":")}`;
}

export const restaurantKeyById = (id: string) => getKeyName("restaurants", id);
