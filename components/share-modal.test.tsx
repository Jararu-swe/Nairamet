import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareModal } from "./share-modal";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * Test suite for ShareModal analytics tracking
 * Tests that share_completed and link_copied events fire correctly
 */
describe("ShareModal Analytics", () => {
  // Mock fetch globally
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  // Mock toast
  const mockToast = vi.fn();
  vi.mock("@/hooks/use-toast", () => ({
    useToast: () => ({ toast: mockToast }),
  }));

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    shareUrl: "https://nairamet.com/rate?currency=NGN&rate=1550.5",
    shareText: "Check the current NGN exchange rate: 1550.5",
    shareTitle: "NGN Exchange Rate",
    currency: "NGN",
    rate: 1550.5,
    widgetType: "rates" as const,
  };

  beforeEach(() => {
    mockFetch.mockClear();
    mockToast.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("share_completed event - social media buttons", () => {
    it("should fire share_completed with twitter platform on Twitter button click", async () => {
      // Mock window.open
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/analytics/share",
          expect.any(Object),
        );
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.eventType).toBe("share_completed");
      expect(body.platform).toBe("twitter");
    });

    it("should fire share_completed with facebook platform on Facebook button click", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const facebookButton = screen.getByRole("button", { name: /facebook/i });
      await userEvent.click(facebookButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.platform).toBe("facebook");
      });
    });

    it("should fire share_completed with whatsapp platform on WhatsApp button click", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const whatsappButton = screen.getByRole("button", { name: /whatsapp/i });
      await userEvent.click(whatsappButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.platform).toBe("whatsapp");
      });
    });

    it("should fire share_completed with telegram platform on Telegram button click", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const telegramButton = screen.getByRole("button", { name: /telegram/i });
      await userEvent.click(telegramButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.platform).toBe("telegram");
      });
    });

    it("should include all required data in share_completed event", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(
        <ShareModal
          {...defaultProps}
          currency="USD"
          rate={500.25}
          widgetType="converter"
        />,
      );

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);

        expect(body).toMatchObject({
          eventType: "share_completed",
          widgetType: "converter",
          currency: "USD",
          rate: 500.25,
          platform: "twitter",
          timestamp: expect.any(String),
        });
      });
    });

    it("should track events for all social media platforms", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      const platforms = ["twitter", "facebook", "whatsapp", "telegram"];

      for (const platform of platforms) {
        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true })),
        );

        const { unmount } = render(<ShareModal {...defaultProps} />);

        const button = screen.getByRole("button", {
          name: new RegExp(platform, "i"),
        });
        await userEvent.click(button);

        await waitFor(() => {
          const body = JSON.parse(mockFetch.mock.calls[0][1].body);
          expect(body.platform).toBe(platform);
        });

        unmount();
      }
    });
  });

  describe("link_copied event", () => {
    it("should fire link_copied with copy platform on copy button click", async () => {
      // Mock Clipboard API
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /copy link/i });
      await userEvent.click(copyButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/analytics/share",
          expect.any(Object),
        );
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.eventType).toBe("link_copied");
      expect(body.platform).toBe("copy");
    });

    it("should include all required data in link_copied event", async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(
        <ShareModal
          {...defaultProps}
          currency="EUR"
          rate={750.5}
          widgetType="chart"
        />,
      );

      const copyButton = screen.getByRole("button", { name: /copy link/i });
      await userEvent.click(copyButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);

        expect(body).toMatchObject({
          eventType: "link_copied",
          widgetType: "chart",
          currency: "EUR",
          rate: 750.5,
          platform: "copy",
          timestamp: expect.any(String),
        });
      });
    });

    it("should fire link_copied even with fallback copy method", async () => {
      // Mock missing Clipboard API - will use fallback
      Object.assign(navigator, {
        clipboard: undefined,
      });

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /copy link/i });
      await userEvent.click(copyButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.eventType).toBe("link_copied");
        expect(body.platform).toBe("copy");
      });
    });
  });

  describe("Event accuracy with different data", () => {
    it("should track events with different currencies", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      const currencies = ["NGN", "USD", "EUR", "GBP", "CAD"];

      for (const currency of currencies) {
        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true })),
        );

        const { unmount } = render(
          <ShareModal {...defaultProps} currency={currency} />,
        );

        const twitterButton = screen.getByRole("button", { name: /twitter/i });
        await userEvent.click(twitterButton);

        await waitFor(() => {
          const body = JSON.parse(mockFetch.mock.calls[0][1].body);
          expect(body.currency).toBe(currency);
        });

        unmount();
      }
    });

    it("should track events with different rates", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      const rates = [0.5, 1, 100, 1550.5, 10000.25];

      for (const rate of rates) {
        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true })),
        );

        const { unmount } = render(
          <ShareModal {...defaultProps} rate={rate} />,
        );

        const twitterButton = screen.getByRole("button", { name: /twitter/i });
        await userEvent.click(twitterButton);

        await waitFor(() => {
          const body = JSON.parse(mockFetch.mock.calls[0][1].body);
          expect(body.rate).toBe(rate);
        });

        unmount();
      }
    });

    it("should track events with different widget types", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      const widgetTypes = ["rates", "converter", "chart"] as const;

      for (const widgetType of widgetTypes) {
        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true })),
        );

        const { unmount } = render(
          <ShareModal {...defaultProps} widgetType={widgetType} />,
        );

        const twitterButton = screen.getByRole("button", { name: /twitter/i });
        await userEvent.click(twitterButton);

        await waitFor(() => {
          const body = JSON.parse(mockFetch.mock.calls[0][1].body);
          expect(body.widgetType).toBe(widgetType);
        });

        unmount();
      }
    });
  });

  describe("Events don't block user actions", () => {
    it("should copy link immediately even if analytics fails", async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      // Analytics fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<ShareModal {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /copy link/i });

      const startTime = Date.now();
      await userEvent.click(copyButton);
      const endTime = Date.now();

      // Should complete quickly and show success
      expect(endTime - startTime).toBeLessThan(100);
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Link copied!",
          }),
        );
      });
    });

    it("should open social share immediately even if analytics fails", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      // Analytics fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });

      const startTime = Date.now();
      await userEvent.click(twitterButton);
      const endTime = Date.now();

      // Should open window immediately
      expect(mockWindowOpen).toHaveBeenCalled();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should use fire-and-forget analytics with timeout", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      // Simulate slow analytics that will timeout
      const neverResolvingPromise = new Promise(() => {});
      mockFetch.mockReturnValueOnce(neverResolvingPromise);

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });

      const startTime = Date.now();
      await userEvent.click(twitterButton);
      const endTime = Date.now();

      // Should complete quickly despite analytics timeout
      expect(endTime - startTime).toBeLessThan(100);
      expect(mockWindowOpen).toHaveBeenCalled();
    });
  });

  describe("Analytics with network failures", () => {
    it("should handle analytics fetch errors for social media share", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      // Should not throw or prevent window opening
      expect(mockWindowOpen).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle analytics fetch errors for copy link", async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<ShareModal {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /copy link/i });
      await userEvent.click(copyButton);

      // Should still show success toast despite analytics error
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Link copied!",
          }),
        );
      });
    });

    it("should handle analytics timeout gracefully", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      // Simulate timeout by signal abort
      mockFetch.mockImplementationOnce((url, options) => {
        // Abort the signal to simulate timeout
        options.signal.dispatchEvent(new Event("abort"));
        return new Promise(() => {}); // Never resolves
      });

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      // Should still open window despite timeout
      expect(mockWindowOpen).toHaveBeenCalled();
    });

    it("should handle 4xx analytics errors", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Invalid data" }), {
          status: 400,
        }),
      );

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      // Should not block action
      expect(mockWindowOpen).toHaveBeenCalled();
    });

    it("should handle 5xx analytics errors", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
        }),
      );

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      // Should not block action
      expect(mockWindowOpen).toHaveBeenCalled();
    });
  });

  describe("Multiple events tracking", () => {
    it("should track multiple social media shares in sequence", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      render(<ShareModal {...defaultProps} />);

      // Click Twitter
      let twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.platform).toBe("twitter");
      });

      // Click Facebook
      const facebookButton = screen.getByRole("button", { name: /facebook/i });
      await userEvent.click(facebookButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[1][1].body);
        expect(body.platform).toBe("facebook");
      });
    });

    it("should track social share and copy in same session", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      render(<ShareModal {...defaultProps} />);

      // Share on Twitter
      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      // Copy link
      const copyButton = screen.getByRole("button", { name: /copy link/i });
      await userEvent.click(copyButton);

      await waitFor(() => {
        // Should have 2 calls: one for twitter share, one for copy
        const calls = mockFetch.mock.calls;
        const twitterEvent = JSON.parse(calls[0][1].body);
        const copyEvent = JSON.parse(calls[1][1].body);

        expect(twitterEvent.platform).toBe("twitter");
        expect(copyEvent.platform).toBe("copy");
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid consecutive social share clicks", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });

      // Rapid clicks
      await userEvent.click(twitterButton);
      await userEvent.click(twitterButton);
      await userEvent.click(twitterButton);

      await waitFor(() => {
        // Should track all clicks
        expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(3);
      });
    });

    it("should handle popup blocked error in social share", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue(null); // Popup blocked
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      // Should show error toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Share failed",
            variant: "destructive",
          }),
        );
      });
    });

    it("should provide timestamp in correct ISO format", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareModal {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /twitter/i });
      await userEvent.click(twitterButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        // Timestamp should be valid ISO string
        expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
      });
    });
  });
});
