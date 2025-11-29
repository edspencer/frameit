#!/usr/bin/env npx tsx
/**
 * API Image Generation Test Suite
 *
 * Runs image generation tests against a FrameIt API deployment.
 * Designed to work in CI against Vercel preview deployments.
 *
 * Usage:
 *   npx tsx tests/api/image-generation.ts [options]
 *
 * Options:
 *   --host <url>     API host URL (default: https://frameit.dev)
 *   --output <dir>   Output directory for generated images (default: ./test-output)
 *   --json           Output results as JSON (for CI parsing)
 *   --help           Show help
 *
 * Environment variables:
 *   API_HOST         Alternative way to set the host URL
 *
 * Exit codes:
 *   0 - All tests passed
 *   1 - One or more tests failed
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface TestCase {
  name: string
  description: string
  params: Record<string, string>
}

interface TestCasesFile {
  testCases: TestCase[]
}

interface TestResult {
  name: string
  success: boolean
  error?: string
  filePath?: string
  fileSize?: number
  duration?: number
}

interface TestSummary {
  host: string
  totalTests: number
  passed: number
  failed: number
  duration: number
  results: TestResult[]
}

function parseArgs(): { host: string; outputDir: string; jsonOutput: boolean } {
  const args = process.argv.slice(2)
  let host = process.env.API_HOST || 'https://frameit.dev'
  let outputDir = './test-output'
  let jsonOutput = false

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--host':
        host = args[++i]
        break
      case '--output':
        outputDir = args[++i]
        break
      case '--json':
        jsonOutput = true
        break
      case '--help':
        console.log(`
API Image Generation Test Suite

Usage:
  npx tsx tests/api/image-generation.ts [options]

Options:
  --host <url>     API host URL (default: https://frameit.dev)
  --output <dir>   Output directory for generated images (default: ./test-output)
  --json           Output results as JSON (for CI parsing)
  --help           Show help

Environment variables:
  API_HOST         Alternative way to set the host URL

Examples:
  # Test against production
  npx tsx tests/api/image-generation.ts

  # Test against Vercel preview deployment
  npx tsx tests/api/image-generation.ts --host https://frameit-abc123.vercel.app

  # CI mode with JSON output
  API_HOST=https://preview.vercel.app npx tsx tests/api/image-generation.ts --json
`)
        process.exit(0)
    }
  }

  // Ensure host doesn't have trailing slash
  host = host.replace(/\/$/, '')

  return { host, outputDir, jsonOutput }
}

async function loadTestCases(): Promise<TestCase[]> {
  const testCasesPath = join(__dirname, 'test-cases.json')
  const content = await readFile(testCasesPath, 'utf-8')
  const data: TestCasesFile = JSON.parse(content)
  return data.testCases
}

async function generateImage(
  host: string,
  testCase: TestCase,
  outputDir: string
): Promise<TestResult> {
  const startTime = Date.now()
  const queryParams = new URLSearchParams(testCase.params).toString()
  const url = `${host}/api/generate?${queryParams}`
  const extension = testCase.params.format || 'png'
  const outputPath = join(outputDir, `${testCase.name}.${extension}`)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const text = await response.text()
      return {
        name: testCase.name,
        success: false,
        error: `HTTP ${response.status}: ${text.slice(0, 200)}`,
        duration: Date.now() - startTime,
      }
    }

    const buffer = await response.arrayBuffer()

    // Validate we got actual image data (PNG starts with specific bytes)
    const bytes = new Uint8Array(buffer)
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
    const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46

    if (!isPng && !isWebp) {
      return {
        name: testCase.name,
        success: false,
        error: 'Invalid image data received (expected PNG or WebP)',
        duration: Date.now() - startTime,
      }
    }

    await writeFile(outputPath, Buffer.from(buffer))

    return {
      name: testCase.name,
      success: true,
      filePath: outputPath,
      fileSize: buffer.byteLength,
      duration: Date.now() - startTime,
    }
  } catch (error) {
    return {
      name: testCase.name,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - startTime,
    }
  }
}

async function main() {
  const { host, outputDir, jsonOutput } = parseArgs()

  // Load test cases
  const testCases = await loadTestCases()

  if (!jsonOutput) {
    console.log('\n🧪 FrameIt API Image Generation Tests\n')
    console.log(`   Host: ${host}`)
    console.log(`   Output: ${outputDir}`)
    console.log(`   Tests: ${testCases.length}\n`)
  }

  // Create output directory
  await mkdir(outputDir, { recursive: true })

  // Run tests
  const startTime = Date.now()
  const results: TestResult[] = []

  for (const testCase of testCases) {
    if (!jsonOutput) {
      process.stdout.write(`   ${testCase.name}... `)
    }

    const result = await generateImage(host, testCase, outputDir)
    results.push(result)

    if (!jsonOutput) {
      if (result.success) {
        const sizeKb =
          typeof result.fileSize === 'number' ? (result.fileSize / 1024).toFixed(1) : 'unknown'
        console.log(`✓ (${sizeKb} KB, ${result.duration}ms)`)
      } else {
        console.log(`✗ ${result.error}`)
      }
    }
  }

  const totalDuration = Date.now() - startTime
  const passed = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  const summary: TestSummary = {
    host,
    totalTests: testCases.length,
    passed,
    failed,
    duration: totalDuration,
    results,
  }

  if (jsonOutput) {
    console.log(JSON.stringify(summary, null, 2))
  } else {
    console.log('\n   ────────────────────────────────────')
    console.log(`   ✓ Passed: ${passed}`)
    if (failed > 0) {
      console.log(`   ✗ Failed: ${failed}`)
    }
    console.log(`   ⏱ Duration: ${(totalDuration / 1000).toFixed(1)}s`)
    console.log(`   📊 Average: ${(totalDuration / testCases.length).toFixed(0)}ms per image\n`)

    if (failed > 0) {
      console.log('   Failed tests:')
      for (const result of results.filter((r) => !r.success)) {
        console.log(`     - ${result.name}: ${result.error}`)
      }
      console.log()
    }
  }

  // Exit with error code if any tests failed
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
