/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    HOST: process.env.NGINX_HOST || 'localhost',
    EXTERNAL_API_HOST: `https://api.${process.env.NGINX_HOST || 'localhost'}`,
    INTERNAL_API_HOST: `http://${process.env.NEST_CORE_HOST || 'localhost'}:${
      process.env.NEST_CORE_PORT || '3000'
    }`,
    /** Time in seconds */
    ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || String(60 * 60),
    /** Time in seconds */
    REFRESH_TOKEN_LIFETIME:
      process.env.REFRESH_TOKEN_LIFETIME || String(60 * 60 * 24 * 7),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  },
};

export default nextConfig;
