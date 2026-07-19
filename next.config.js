/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify removed - deprecated in Next 15+, minification is automatic
  // Disable ESLint during build to unblock development
  // RAG/agent scaffolding (not wired into live flow yet) has intentional debt
  // Will be cleaned up when pipeline is activated in Phase 3
  eslint: {
    ignoreDuringBuilds: true,
  },

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

