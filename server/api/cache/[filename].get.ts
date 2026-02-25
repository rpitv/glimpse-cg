import { defineEventHandler, getRouterParam } from 'h3';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { lookup } from 'mime-types';

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename');
  if (!filename) {
    throw createError({ statusCode: 400, statusMessage: 'No filename provided' });
  }

  const filepath = join(process.cwd(), '.cache', filename);
  if (!existsSync(filepath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' });
  }

  const file = readFileSync(filepath);
  const mimeType = lookup(filename) || 'application/octet-stream';
  event.node.res.setHeader('Content-Type', mimeType);
  return file;
});