/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  }, {
  images: {
    domains: ["res.cloudinary.com"], // Cloudinary domain added for image optimization
  },
};
