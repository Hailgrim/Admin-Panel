import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  i18n: {
    vueI18n: './i18n.config.ts',
  },
  runtimeConfig: {
    public: {
      NGINX_HOST: process.env.NGINX_HOST || 'localhost',
      NEST_CORE_HOST: process.env.NEST_CORE_HOST || 'localhost',
      NEST_CORE_PORT: process.env.NEST_CORE_PORT || '3000',
      /** Time in seconds */
      ACCESS_TOKEN_LIFETIME:
        process.env.ACCESS_TOKEN_LIFETIME || String(60 * 60),
      /** Time in seconds */
      REFRESH_TOKEN_LIFETIME:
        process.env.REFRESH_TOKEN_LIFETIME || String(60 * 60 * 24 * 7),
    },
  },
})
