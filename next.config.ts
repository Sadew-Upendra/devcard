import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/card/[username]/image": ["./src/assets/fonts/**/*"],
    "/api/card/[username]/og": ["./src/assets/fonts/**/*"],
    "/opengraph-image": ["./src/assets/fonts/**/*"],
  },
};

export default nextConfig;
