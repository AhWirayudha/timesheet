import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Disable problematic experimental features for better stability
    // ppr: true, // Disabled - can cause issues with route groups
    // clientSegmentCache: true, // Disabled - can cause build issues
    // nodeMiddleware: true // Disabled - not needed for most apps
  },
  // Add output configuration for better Vercel compatibility
  output: 'standalone',
  // Ensure proper handling of route groups
  trailingSlash: false,
  // Disable image optimization if not needed
  images: {
    unoptimized: true
  }
};

export default nextConfig;
