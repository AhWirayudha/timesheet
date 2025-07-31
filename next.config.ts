import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove all experimental features for better stability
  // Ensure proper handling of routes
  trailingSlash: false,
  // Disable image optimization if not needed
  images: {
    unoptimized: true
  }
};

export default nextConfig;
