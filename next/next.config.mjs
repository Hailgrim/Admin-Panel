/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    HOST:
      `${process.env.NEXT_HOST_PREFIX}${process.env.NGINX_HOST}` || 'localhost',
    EXTERNAL_API_HOST: `https://api.${process.env.NGINX_HOST || 'localhost'}`,
    INTERNAL_API_HOST: `http://${process.env.NEST_CORE_HOST || 'localhost'}:${
      process.env.NEST_CORE_PORT || '3000'
    }`,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  },
};

export default nextConfig;
