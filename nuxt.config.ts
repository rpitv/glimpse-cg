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
    externals: {
      external: ['puppeteer-core']
    }
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        indent: 2,
        semi: true,
      },
    },
    checker: true,
  },
  vite: {
    css: {
      devSourcemap: false,
    },
    optimizeDeps: {
      exclude: ['puppeteer-core', 'jsdom']
    }
  }
});
