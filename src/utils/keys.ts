export function getKeyName(...args: string[]) {
  return `learning:${args.join(":")}`;
}
