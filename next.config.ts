import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                aws4: false,
                "mongodb-client-encryption": false,
                snappy: false,
                'mock-aws-s3': false,
                'aws-sdk': false,
                kerberos: false,
                '@mongodb-js/zstd': false,
                '@aws-sdk/credential-providers': false,
                'gcp-metadata': false,
                socks: false,
            };
        }
        return config;
    },
    // Force utilization of Webpack (required by custom config above)
    // as Turbopack is now the default in Next.js 16
    turbopack: undefined, 
    sassOptions: {
        api: 'modern',
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'mixed-decls', 'color-functions'],
    },
};

export default nextConfig;

