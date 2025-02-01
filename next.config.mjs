/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'data.tascpa.ca',
            
          },
        ],
      },
};

export default nextConfig;
