import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error: Vuetify Error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      host:
        `${process.env.NUXT_HOST_PREFIX}${process.env.NGINX_HOST}`
        || 'localhost',
      externalApiHost: `https://api.${process.env.NGINX_HOST || 'localhost'}`,
      internalApiHost: `http://${process.env.NEST_CORE_HOST || 'localhost'}:${
        process.env.NEST_CORE_PORT || '3000'
      }`,
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2024-11-01',
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
