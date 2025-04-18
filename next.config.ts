import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        port: '',
        pathname: '/guid/**',
        search: '',
      },
      // https://a.espncdn.com/i/teamlogos/ncaa_conf/500/big_east.png
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        port: '',
        pathname: '/i/teamlogos/ncaa_conf/**',
        search: '',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
