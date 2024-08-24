import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

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
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error: from vuetify docs
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
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
      HOST: process.env.NGINX_HOST || 'localhost',
      EXTERNAL_API_HOST: `https://api.${process.env.NGINX_HOST || 'localhost'}`,
      INTERNAL_API_HOST: `http://${process.env.NEST_CORE_HOST || 'localhost'}:${
        process.env.NEST_CORE_PORT || '3000'
      }`,
      /** Time in seconds */
      ACCESS_TOKEN_LIFETIME:
        process.env.ACCESS_TOKEN_LIFETIME || String(60 * 60),
      /** Time in seconds */
      REFRESH_TOKEN_LIFETIME:
        process.env.REFRESH_TOKEN_LIFETIME || String(60 * 60 * 24 * 7),
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
})
