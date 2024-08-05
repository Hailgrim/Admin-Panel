// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
  },
  hooks: {
    // NOTE: temporary WSS fix
    'vite:extendConfig': (config) => {
      if (typeof config.server!.hmr === 'object') {
        config.server!.hmr.protocol = 'wss'
      }
    },
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
