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
      host: process.env.PANEL_VUE_URL || 'vue.localhost.com',
      apiHostInternal: `http://${process.env.API_HOST || 'localhost'}:${
        process.env.API_PORT || '3000'
      }`,
      apiHostExternal: `https://${process.env.API_URL || 'api.localhost.com'}`,
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2024-11-01',
  vite: {
    server: {
      allowedHosts: [process.env.PANEL_VUE_URL || 'vue.localhost.com'],
    },
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
