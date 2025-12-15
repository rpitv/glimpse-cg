import { defineEventHandler, readMultipartFormData } from 'h3';
import { join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data' });
  }

  const file = formData.find(item => item.name === 'file');
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  // Generate a hash for the file
  const hash = createHash('sha256').update(file.data).digest('hex');
  const ext = file.filename ? '.' + file.filename.split('.').pop() : '';
  const filename = hash + ext;
  const cacheDir = join(process.cwd(), '.cache');
  const filepath = join(cacheDir, filename);

  // Ensure .cache directory exists
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }

  // Save the file
  writeFileSync(filepath, file.data);

  // Return the path relative to public or something, but since it's .cache, perhaps serve it via API
  // For now, return the filename, and assume the frontend will access via /api/cache/filename or something
  return { filename };
});