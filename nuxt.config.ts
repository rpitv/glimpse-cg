// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  devtools: { enabled: true },
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  compatibilityDate: '2025-05-15',
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  vite: {
    build: {
      sourcemap: false,
    },
    css: {
      devSourcemap: false,
    },
    optimizeDeps: {
      exclude: ['jsdom'],
    },
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        indent: 2,
        semi: true,
      },
    },
    checker: false,
  },
  ssr: false,
  typescript: {
    typeCheck: false
  },
  experimental: {
    buildCache: true,
  },
  hooks: {
    close: () => {
      process.exit(0);
    }
  }
});
