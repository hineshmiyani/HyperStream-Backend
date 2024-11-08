/**
 * Exclude keys from user
 *
 * @template T extends Record<string, unknown> - The type of the input data
 * @template Key extends keyof T - The type of the keys to be excluded
 * @param {T} data - The input data
 * @param {Key[]} keys - The keys to be excluded
 * @returns {Omit<T, Key>} - The data with the excluded keys
 */
const excludeKeys = <T extends Record<string, unknown>, Key extends keyof T>(
  data: T,
  keys: Key[]
): Omit<T, Key> => {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !keys.includes(key as Key))
  ) as Omit<T, Key>
}

export { excludeKeys }
