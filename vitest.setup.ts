import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'

// Setup timers for happy-dom
beforeAll(() => {
  // Ensure window.clearTimeout is available
  if (typeof window !== 'undefined') {
    if (!window.clearTimeout) {
      window.clearTimeout = globalThis.clearTimeout
    }
    if (!window.setTimeout) {
      window.setTimeout = globalThis.setTimeout
    }
  }
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
