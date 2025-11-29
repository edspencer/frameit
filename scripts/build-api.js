#!/usr/bin/env node
/**
 * Build script for API functions
 * Uses esbuild to bundle the API into a single file that works with Vercel
 */

import { build } from 'esbuild'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

async function buildApi() {
  try {
    await build({
      entryPoints: [join(rootDir, 'api/_generate.ts')],
      bundle: true,
      outfile: join(rootDir, 'api/generate.js'),
      platform: 'node',
      target: 'node20',
      format: 'esm',
      external: [
        '@vercel/node',
        '@resvg/resvg-js',
      ],
      sourcemap: false,
      minify: false,
    })
    console.log('API bundle built successfully')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildApi()
