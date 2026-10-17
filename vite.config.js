import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url))

// Loads .frag / .vert / .glsl files as raw shader strings (glslify/raw-loader equivalent).
function glslRaw() {
  return {
    name: 'glsl-raw',
    enforce: 'pre',
    load(id) {
      const cleanId = id.split('?')[0]
      if (/\.(glsl|vs|fs|vert|frag)$/.test(cleanId)) {
        return `export default ${JSON.stringify(fs.readFileSync(cleanId, 'utf-8'))}`
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [glslRaw(), react()],
  resolve: {
    alias: [
      // giats portfolio sources
      { find: '@src', replacement: resolvePath('./src/giats') },
      { find: /^@\//, replacement: resolvePath('./src/') },
      // Next.js runtime shims so the ported components keep working as-is
      { find: 'next/link', replacement: resolvePath('./src/shims/next-link.jsx') },
      { find: 'next/image', replacement: resolvePath('./src/shims/next-image.jsx') },
      { find: 'next/router', replacement: resolvePath('./src/shims/next-router.js') },
      { find: 'next/head', replacement: resolvePath('./src/shims/next-head.jsx') },
      { find: 'next/dynamic', replacement: resolvePath('./src/shims/next-dynamic.jsx') },
      { find: 'next-seo', replacement: resolvePath('./src/shims/next-seo.js') },
      { find: '@vercel/analytics/react', replacement: resolvePath('./src/shims/vercel-analytics.jsx') },
    ],
  },
})
