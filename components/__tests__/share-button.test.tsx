import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareButton } from '../share-button'

// Mock the ShareModal component
vi.mock('../share-modal', () => ({
  ShareModal: ({ isOpen, onClose }: any) => (
    isOpen ? <div data-testid="share-modal">Share Modal</div> : null
  ),
}))

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock fetch for analytics
global.fetch = vi.fn()

describe('ShareButton', () => {
  const defaultProps = {
    currency: 'USD',
    rate: 1620,
    widgetType: 'rates' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('Rendering', () => {
    it('should render share button', () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      expect(button).toBeInTheDocument()
    })

    it('should render with correct aria-label', () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByLabelText('Share exchange rate')
      expect(button).toBeInTheDocument()
    })

    it('should render share icon', () => {
      const { container } = render(<ShareButton {...defaultProps} />)
      
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ShareButton {...defaultProps} className="custom-class" />
      )
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      expect(button).toHaveClass('custom-class')
    })

    it('should render with all widget types', () => {
      const widgetTypes = ['rates', 'converter', 'chart'] as const
      
      widgetTypes.forEach((type) => {
        const { unmount } = render(
          <ShareButton {...defaultProps} widgetType={type} />
        )
        
        expect(screen.getByRole('button')).toBeInTheDocument()
        unmount()
      })
    })

    it('should render with trend prop for chart widget', () => {
      render(
        <ShareButton {...defaultProps} widgetType="chart" trend="up" />
      )
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Native Share API Detection', () => {
    it('should detect when Native Share API is available', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', {
        share: mockShare,
      })
      vi.stubGlobal('window', {
        self: window,
        top: window,
      })

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
      })
    })

    it('should not use Native Share API when unavailable', async () => {
      vi.stubGlobal('navigator', {})
      
      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })

    it('should detect iframe context', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', {
        share: mockShare,
      })
      
      // Mock iframe context
      const mockWindow = {
        self: {},
        top: { different: true },
      }
      vi.stubGlobal('window', mockWindow)

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      // Should use modal instead of native share in iframe
      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })
  })

  describe('Share Functionality', () => {
    it('should call navigator.share with correct data', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', {
        share: mockShare,
      })
      vi.stubGlobal('window', {
        self: window,
        top: window,
      })

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'USD to NGN Exchange Rate',
          text: 'USD/NGN: ₦1,620 (Black Market) via NairaMet',
          url: expect.stringContaining('nairamet.com'),
        })
      })
    })

    it('should handle AbortError silently', async () => {
      const abortError = new Error('User cancelled')
      abortError.name = 'AbortError'
      const mockShare = vi.fn().mockRejectedValue(abortError)
      
      vi.stubGlobal('navigator', {
        share: mockShare,
      })
      vi.stubGlobal('window', {
        self: window,
        top: window,
      })

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
      })

      // Modal should not open for AbortError
      expect(screen.queryByTestId('share-modal')).not.toBeInTheDocument()
    })

    it('should fall back to modal on NotAllowedError', async () => {
      const notAllowedError = new Error('Permission denied')
      notAllowedError.name = 'NotAllowedError'
      const mockShare = vi.fn().mockRejectedValue(notAllowedError)
      
      vi.stubGlobal('navigator', {
        share: mockShare,
      })
      vi.stubGlobal('window', {
        self: window,
        top: window,
      })

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })

    it('should fall back to modal on other errors', async () => {
      const mockShare = vi.fn().mockRejectedValue(new Error('Unknown error'))
      
      vi.stubGlobal('navigator', {
        share: mockShare,
      })
      vi.stubGlobal('window', {
        self: window,
        top: window,
      })

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })

    it('should open modal when Native Share API is not available', async () => {
      vi.stubGlobal('navigator', {})

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })
  })

  describe('Analytics', () => {
    it('should log share_initiated event on button click', async () => {
      vi.stubGlobal('navigator', {})

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/analytics/share',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('share_initiated'),
          })
        )
      })
    })

    it('should log share_completed event on successful native share', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', {
        share: mockShare,
      })
      vi.stubGlobal('window', {
        self: window,
        top: window,
      })

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        const calls = (global.fetch as any).mock.calls
        const completedCall = calls.find((call: any) => 
          call[1]?.body?.includes('share_completed')
        )
        expect(completedCall).toBeDefined()
      })
    })

    it('should include widget type in analytics', async () => {
      vi.stubGlobal('navigator', {})

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} widgetType="converter" />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      await user.click(button)

      await waitFor(() => {
        const calls = (global.fetch as any).mock.calls
        const analyticsCall = calls.find((call: any) => 
          call[0] === '/api/analytics/share'
        )
        expect(analyticsCall[1].body).toContain('converter')
      })
    })

    it('should handle analytics failures gracefully', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))
      vi.stubGlobal('navigator', {})

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      
      // Should not throw error
      await expect(user.click(button)).resolves.not.toThrow()

      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper touch target size', () => {
      const { container } = render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      const styles = window.getComputedStyle(button)
      
      // Button should have min-height and min-width classes
      expect(button.className).toContain('min-h-')
      expect(button.className).toContain('min-w-')
    })

    it('should be keyboard accessible', async () => {
      vi.stubGlobal('navigator', {})

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      
      // Tab to button
      await user.tab()
      expect(button).toHaveFocus()
      
      // Press Enter
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })

    it('should have focus-visible styles', () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      expect(button.className).toContain('focus-visible')
    })

    it('should activate with Space key', async () => {
      vi.stubGlobal('navigator', {})

      const user = userEvent.setup()
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      button.focus()
      
      // Press Space
      await user.keyboard(' ')
      
      await waitFor(() => {
        expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      })
    })

    it('should have descriptive aria-label for screen readers', () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      expect(button).toHaveAttribute('aria-label', 'Share exchange rate')
    })

    it('should have tooltip for visual users', async () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      
      // Tooltip content should be present in DOM
      const user = userEvent.setup()
      await user.hover(button)
      
      // Wait for tooltip to appear
      await waitFor(() => {
        expect(screen.getByText('Share rate')).toBeInTheDocument()
      })
    })

    it('should meet minimum touch target size of 44x44px on mobile', () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      
      // Check for mobile touch target classes
      expect(button.className).toMatch(/min-h-\[44px\]/)
      expect(button.className).toMatch(/min-w-\[44px\]/)
    })

    it('should have proper focus ring with sufficient contrast', () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      
      // Check for focus-visible ring styles
      expect(button.className).toContain('focus-visible:ring-2')
      expect(button.className).toContain('focus-visible:ring-emerald-500')
      expect(button.className).toContain('focus-visible:ring-offset-2')
    })

    it('should support dark mode with proper contrast', () => {
      render(<ShareButton {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /share exchange rate/i })
      
      // Check for dark mode classes
      expect(button.className).toContain('dark:hover:bg-gray-700')
      expect(button.className).toContain('dark:text-gray-400')
      expect(button.className).toContain('dark:focus-visible:ring-emerald-400')
    })
  })
})
