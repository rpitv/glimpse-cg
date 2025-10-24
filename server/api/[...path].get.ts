import { replicants } from "~/utils/replicants";

function getValueByPath(obj: any, pathArray: string[]) {
  let current = obj;
  for (const key of pathArray) {
    if (!current || typeof current !== "object") return undefined;
    // Find the key in current object, case-insensitively
    const foundKey = Object.keys(current).find(k => k.toLowerCase() === key.toLowerCase());
    if (!foundKey) return undefined;
    current = current[foundKey];
  }
  return current;
}

export default defineEventHandler(async (event) => {
  const params = getRouterParam(event, 'path')?.split('/') ?? [];
  const value = getValueByPath(replicants, params)
  if (value)
    return value;
  else
    throw createError({ statusCode: 404, statusMessage: 'Replicant Value Not Found' });
})
