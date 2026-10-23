import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep an authorized production build from colliding with a running dev server.
  distDir: process.env.MINDFLARE_NEXT_DIST_DIR || '.next',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  outputFileTracingRoot: __dirname,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tabler/icons-react',
      '@hugeicons/core-free-icons',
      'motion',
      '@clerk/nextjs',
      'katex',
      'three',
      'apexcharts',
      'react-apexcharts',
      'fuse.js',
      'canvas-confetti',
      'radix-ui',
      'cmdk',
      '@iconify/react',
      '@base-ui/react',
      'gsap',
      '@monaco-editor/react',
    ],
  },
  async headers() {
    return [
      {
        source: '/vendor/monaco/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
  },
});

export default withMDX(nextConfig);
