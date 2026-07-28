import type { NextConfig } from "next";

const nextconfig: NextConfig = {
  eslint: {
    // يمنع أخطاء الـ ESLint من إيقاف عملية الـ Build على Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextconfig;