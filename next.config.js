// const withSass = require('@zeit/next-sass');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // experimental: {
  //     images: {
  //         allowFutureImage: true
  //     }
  // },
}

// module.exports = withSass({
//   ...nextConfig,
//   sassOptions: {
//     includePaths: ['compass'],
//   },
// });
module.exports = nextConfig