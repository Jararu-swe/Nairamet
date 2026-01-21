import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareButton } from '../share-button'

// Mock the toast hook
const mockToast = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock ShareModal for ShareButton tests
vi.mock('../share-modal', () => ({
  ShareModal: ({ isOpen, onClose }: any) => (
    isOpen ? <div data-testid="share-modal">Share Modal</div> : null
  ),
}))

// Mock fetch for analytics
global.fetch = vi.fn()

describe('Share Analytics Tracking - Task 8.4', () => {
  const defaultButtonProps = {
    currency: 'USD',
    rate: 1620,
    widgetType: 'rates' as const,
  }

  const defaultModalProps = {
    isOpen: true,
    onClose: vi.fn(),
    shareUrl: 'https://nairamet.com?ref=widget&currency=USD&rate=1620',
    shareText: 'USD/NGN: ₦1,620 (Black Market) via NairaMet',
    shareTitle: 'USD to NGN Exchange Rate',
    currency: 'USD',
    rate: 1620,
    widgetType: 'rates' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    vi.stubGlobal('open', vi.fn().mockReturnValue({ closed: false }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // Requirement 7.1: Verify share_initiated events fire correctly
  describe('share_initiated events', () => {
    it('should fire when share button is clicked', async () => {
      vi.stubGlobal('navigator', {})
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      await waitFor(() => {
        const calls = (global.fetch as any).mock.calls
        const initiatedCall = calls.find((call: any) => 
          call[0] === '/api/analytics/share' &&
          call[1]?.body?.includes('share_initiated')
        )
        expect(initiatedCall).toBeDefined()
      })
    })

    it('should include widget type in event', async () => {
      vi.stubGlobal('navigator', {})
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} widgetType="converter" />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      await waitFor(() => {
        const calls = (global.fetch as any).mock.calls
        const initiatedCall = calls.find((call: any) => 
          call[1]?.body?.includes('share_initiated')
        )
        expect(initiatedCall[1].body).toContain('converter')
      })
    })
  })

  // Requirement 7.2: Verify share_completed events include correct platform data
  describe('share_completed events with platform data', () => {
    it('should include native platform on successful native share', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { share: mockShare })
      vi.stubGlobal('window', { self: window, top: window })
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check analytics was called with correct data
      const calls = (global.fetch as any).mock.calls
      const completedCall = calls.find((call: any) => 
        call[1]?.body?.includes('share_completed')
      )
      expect(completedCall).toBeDefined()
      expect(completedCall[1].body).toContain('native')
      expect(mockShare).toHaveBeenCalled()
    })

    it('should include currency and rate in events', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { share: mockShare })
      vi.stubGlobal('window', { self: window, top: window })
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} currency="EUR" rate={1800} />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check analytics was called with correct data
      const calls = (global.fetch as any).mock.calls
      const completedCall = calls.find((call: any) => 
        call[1]?.body?.includes('share_completed')
      )
      expect(completedCall[1].body).toContain('EUR')
      expect(completedCall[1].body).toContain('1800')
      expect(mockShare).toHaveBeenCalled()
    })
  })

  // Requirement 7.4: Test analytics with network failures
  describe('analytics with network failures', () => {
    it('should not block share when analytics fails', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))
      vi.stubGlobal('navigator', {})
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      await expect(user.click(screen.getByRole('button', { name: /share exchange rate/i }))).resolves.not.toThrow()

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })

    it('should not block share when analytics times out', async () => {
      ;(global.fetch as any).mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 10000))
      )
      vi.stubGlobal('navigator', {})
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('should not block native share when analytics fails', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { share: mockShare })
      vi.stubGlobal('window', { self: window, top: window })
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Native share should still be called
      expect(mockShare).toHaveBeenCalled()
    })
  })

  // Requirement 7.5: Verify events don't block user actions
  describe('events do not block user actions', () => {
    it('should open modal immediately without waiting for analytics', async () => {
      let analyticsResolved = false
      ;(global.fetch as any).mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => {
            analyticsResolved = true
            resolve({ ok: true, json: async () => ({}) })
          }, 2000)
        })
      )
      vi.stubGlobal('navigator', {})
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
        expect(analyticsResolved).toBe(false)
      }, { timeout: 500 })
    })

    it('should trigger native share immediately without waiting', async () => {
      let analyticsResolved = false
      ;(global.fetch as any).mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => {
            analyticsResolved = true
            resolve({ ok: true, json: async () => ({}) })
          }, 2000)
        })
      )
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { share: mockShare })
      vi.stubGlobal('window', { self: window, top: window })
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Native share should be called
      expect(mockShare).toHaveBeenCalled()
      // Analytics should not have resolved yet
      expect(analyticsResolved).toBe(false)
    })

    it('should not block UI thread during analytics call', async () => {
      ;(global.fetch as any).mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 1000))
      )
      vi.stubGlobal('navigator', {})
      const user = userEvent.setup()
      render(<ShareButton {...defaultButtonProps} />)
      
      const startTime = Date.now()
      await user.click(screen.getByRole('button', { name: /share exchange rate/i }))
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(100)
      
      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })
  })
})
