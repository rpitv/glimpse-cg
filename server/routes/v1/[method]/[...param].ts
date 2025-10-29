
import { methods } from '../method';

// Common API response
function apiResponseV1(event: any, code: number, msg: string, data = {}) {
  return {
    statusCode: code,
    body: { code, msg, data }
  };
}

// Panic API response
function apiFatalPanik(event: any, msg = "") {
  return apiResponseV1(event, 501, `FATAL ERROR: REPORT TO DEVS THIS URL IMMEDIATELY!!!!!\n${msg}`, event.path);
}

// Main API handler
export default defineEventHandler(async (event) => {
  const { method, param } = event.context.params as any;
  if (!method) {
    return apiResponseV1(event, 400, "missing method");
  }
  if (!methods[method]) {
    return apiResponseV1(event, 400, "invalid method");
  }
  // Ensure param is always an array of segments
  const paramArr = typeof param === 'string' ? param.split('/') : Array.isArray(param) ? param : [];
  return await methods[method](event, paramArr);
});