/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  env: {
    NGINX_HOST: process.env.NGINX_HOST || 'localhost',
    NEST_CORE_HOST: process.env.NEST_CORE_HOST || 'localhost',
    NEST_CORE_PORT: process.env.NEST_CORE_PORT || '3000',
    /** Time in seconds */
    ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || String(60 * 60),
    /** Time in seconds */
    REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME || String(60 * 60 * 24 * 7),
  },
  output: 'standalone',
  webpack: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    }
    return config
  },
}

module.exports = nextConfig
