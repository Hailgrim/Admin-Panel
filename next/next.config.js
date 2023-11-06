/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  webpack: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    }
    return config
  }

}

module.exports = nextConfig
