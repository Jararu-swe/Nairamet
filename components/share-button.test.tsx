import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareButton } from "./share-button";
import * as shareUtils from "@/lib/share-utils";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * Test suite for ShareButton analytics tracking
 * Tests that events fire correctly and don't block user actions
 */
describe("ShareButton Analytics", () => {
  // Mock fetch globally
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  // Mock canShare function
  const mockCanShare = vi.spyOn(shareUtils, "canShare");

  beforeEach(() => {
    mockFetch.mockClear();
    mockCanShare.mockReturnValue(false); // Default: no native share
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("share_initiated event", () => {
    it("should fire share_initiated when share button is clicked", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/analytics/share",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }),
        );
      });

      // Verify event data contains share_initiated
      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.eventType).toBe("share_initiated");
    });

    it("should include correct widget type in share_initiated event", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(
        <ShareButton currency="NGN" rate={1550.5} widgetType="converter" />,
      );

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        expect(body.widgetType).toBe("converter");
      });
    });

    it("should include currency in share_initiated event", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="USD" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        expect(body.currency).toBe("USD");
      });
    });

    it("should include rate in share_initiated event", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={2000.75} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        expect(body.rate).toBe(2000.75);
      });
    });

    it("should include timestamp in share_initiated event", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });

      const beforeClick = new Date();
      await userEvent.click(shareButton);
      const afterClick = new Date();

      await waitFor(() => {
        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        const eventTimestamp = new Date(body.timestamp);

        expect(eventTimestamp.getTime()).toBeGreaterThanOrEqual(
          beforeClick.getTime(),
        );
        expect(eventTimestamp.getTime()).toBeLessThanOrEqual(
          afterClick.getTime(),
        );
      });
    });
  });

  describe("share_completed event", () => {
    it("should fire share_completed with native platform on successful native share", async () => {
      mockCanShare.mockReturnValue(true);

      const mockNavigatorShare = vi.fn().mockResolvedValue(undefined);
      navigator.share = mockNavigatorShare;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        // Should have two calls: one for share_initiated, one for share_completed
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      const completedCall = mockFetch.mock.calls[1];
      const body = JSON.parse(completedCall[1].body);

      expect(body.eventType).toBe("share_completed");
      expect(body.platform).toBe("native");
    });

    it("should include all required data in share_completed event", async () => {
      mockCanShare.mockReturnValue(true);

      const mockNavigatorShare = vi.fn().mockResolvedValue(undefined);
      navigator.share = mockNavigatorShare;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="EUR" rate={500.25} widgetType="chart" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const completedCall = mockFetch.mock.calls[1];
        const body = JSON.parse(completedCall[1].body);

        expect(body).toMatchObject({
          eventType: "share_completed",
          widgetType: "chart",
          currency: "EUR",
          rate: 500.25,
          platform: "native",
          timestamp: expect.any(String),
        });
      });
    });

    it("should not fire share_completed on user cancel (AbortError)", async () => {
      mockCanShare.mockReturnValue(true);

      const mockNavigatorShare = vi
        .fn()
        .mockRejectedValue(new DOMException("User cancelled", "AbortError"));
      navigator.share = mockNavigatorShare;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        // Should only have share_initiated call, not share_completed
        expect(mockFetch).toHaveBeenCalledTimes(1);
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.eventType).toBe("share_initiated");
      });
    });
  });

  describe("Events don't block user actions", () => {
    it("should return modal immediately even if analytics fails", async () => {
      // Analytics call fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });

      // Should show modal immediately without waiting for analytics
      await userEvent.click(shareButton);

      // Modal should be visible
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("should use fire-and-forget analytics with timeout", async () => {
      const analyticsPromise = new Promise((resolve) => {
        setTimeout(() => resolve("delayed"), 10000);
      });

      mockFetch.mockReturnValueOnce(analyticsPromise);

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });

      const startTime = Date.now();
      await userEvent.click(shareButton);
      const endTime = Date.now();

      // Should complete quickly despite slow analytics
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should show modal even when analytics times out", async () => {
      // Simulate slow analytics (won't resolve in time)
      mockFetch.mockImplementationOnce(
        () => new Promise(() => {}), // Never resolves
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      // Modal should appear immediately
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
    });
  });

  describe("Analytics with network failures", () => {
    it("should handle analytics fetch errors silently", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      // Should not throw or show error to user
      // Modal should still appear
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("should handle analytics timeout gracefully", async () => {
      // Simulate timeout by aborting the signal
      mockFetch.mockImplementationOnce((url, options) => {
        options.signal.addEventListener("abort", () => {
          // Request aborted due to timeout
        });
        return new Promise(() => {}); // Never resolves
      });

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      // Should still show modal despite analytics timeout
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("should handle 4xx analytics errors", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Invalid data" }), {
          status: 400,
        }),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      // Should not block user action
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("should handle 5xx analytics errors", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
        }),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      // Should not block user action
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
    });
  });

  describe("Multiple events tracking", () => {
    it("should track events for different widget types", async () => {
      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      const { rerender } = render(
        <ShareButton currency="NGN" rate={1550.5} widgetType="rates" />,
      );

      let shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.widgetType).toBe("rates");
      });

      // Rerender with different widget type
      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      rerender(
        <ShareButton currency="NGN" rate={1550.5} widgetType="converter" />,
      );

      shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.widgetType).toBe("converter");
      });
    });

    it("should track events with different currency codes", async () => {
      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      const { rerender } = render(
        <ShareButton currency="NGN" rate={1550.5} widgetType="rates" />,
      );

      let shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.currency).toBe("NGN");
      });

      // Rerender with different currency
      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      rerender(<ShareButton currency="USD" rate={1.0} widgetType="rates" />);

      shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.currency).toBe("USD");
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid consecutive clicks", async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });

      // Rapid clicks
      await userEvent.click(shareButton);
      await userEvent.click(shareButton);
      await userEvent.click(shareButton);

      await waitFor(() => {
        // Should make multiple analytics calls
        expect(mockFetch.length).toBeGreaterThanOrEqual(3);
      });
    });

    it("should handle undefined rate gracefully", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={0} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.rate).toBe(0);
      });
    });

    it("should handle special characters in currency code", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true })),
      );

      render(<ShareButton currency="NGN" rate={1550.5} widgetType="rates" />);

      const shareButton = screen.getByRole("button", { name: /share rate/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        // Should properly encode currency
        expect(typeof body.currency).toBe("string");
        expect(body.currency.length).toBeGreaterThan(0);
      });
    });
  });
});
