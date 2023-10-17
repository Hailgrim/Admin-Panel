import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
  },
  runtimeConfig: {
    public: {
      PROJECT_TAG: process.env.PROJECT_TAG || 'AP',
      NGINX_HOST: process.env.NGINX_HOST || 'localhost',
      NEST_CORE_HOST: process.env.NEST_CORE_HOST || 'localhost',
      NEST_CORE_PORT: process.env.NEST_CORE_PORT || '3000',
      /** Time in seconds */
      ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || String(60 * 60),
      /** Time in seconds */
      REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME || String(60 * 60 * 24 * 7),
      /** Supported application routes */
      ROUTES: {
        /** Authorization routes */
        auth: {
          signIn: '/authorization',
          signUp: '/registration',
          forget: '/forgot-password',
        },
        /** Panel routes */
        panel: {
          home: '/',
          profile: '/profile',
          users: '/users',
          newUser: '/users/new',
          user: '/users/#ID#',
          roles: '/roles',
          newRole: '/roles/new',
          role: '/roles/#ID#',
          resources: '/resources',
          newResource: '/resources/new',
          resource: '/resources/#ID#',
          files: '/files',
          newFile: '/files/new',
        },
      },
    },
  },
})
