/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Handle @xenova/transformers and other Node.js-only packages
  serverExternalPackages: ['@xenova/transformers', 'onnxruntime-node'],
  webpack: (config, { isServer }) => {
    // Ensure @xenova/transformers only runs server-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
      // Exclude heavy server-only packages from client bundle
      config.externals = config.externals || [];
    }
    return config;
  },
};

module.exports = nextConfig;
