/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'django-backend-9bsw.onrender.com',
      },
    ],
  },
};

export default nextConfig;