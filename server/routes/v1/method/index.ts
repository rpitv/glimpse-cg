// This file aggregates all API method handlers for Nuxt API routing
import announcements from './announcements';
import config from './config';
import football from './football';
import score from './score';
import toggle from './toggle';

export const methods: Record<string, Function> = {
  announcements,
  config,
  football,
  score,
  toggle,
};
