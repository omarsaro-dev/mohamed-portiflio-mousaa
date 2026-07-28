/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  experimental: {
    optimizePackageImports: ['gsap', 'three', '@react-three/fiber', '@react-three/drei']
  }
}

module.exports = nextConfig
