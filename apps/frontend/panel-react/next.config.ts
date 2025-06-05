import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    HOST: process.env.PANEL_REACT_URL || 'localhost.com',
    API_HOST_INTERNAL: `http://${process.env.API_HOST || 'localhost'}:${
      process.env.API_PORT || '3000'
    }`,
    API_HOST_EXTERNAL: `https://${process.env.API_URL || 'api.localhost.com'}`,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  },
  allowedDevOrigins: [process.env.PANEL_REACT_URL || 'localhost.com'],
};

export default nextConfig;
