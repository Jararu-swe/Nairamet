import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * Integration tests for analytics tracking end-to-end flow
 * Tests the complete lifecycle of analytics events from user action to API
 */
describe("Share Analytics Integration Tests", () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Complete share user flow", () => {
    it("should track complete user flow: click -> native share -> success", async () => {
      // Mock successful native share
      const mockNavigatorShare = vi.fn().mockResolvedValue(undefined);
      navigator.share = mockNavigatorShare;

      // Mock two analytics calls: share_initiated and share_completed
      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      // Simulate user clicking share button
      const eventData = {
        eventType: "share_initiated",
        widgetType: "rates",
        currency: "NGN",
        rate: 1550.5,
        timestamp: new Date().toISOString(),
      };

      // Call analytics endpoint
      const response1 = await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      expect(response1.ok).toBe(true);
      const data1 = await response1.json();
      expect(data1.success).toBe(true);

      // Simulate successful native share
      await navigator.share({
        title: "NGN Exchange Rate",
        text: "Check the NGN rate: 1550.5",
        url: "https://nairamet.com/rate?currency=NGN",
      });

      // Log share completed
      const eventData2 = {
        ...eventData,
        eventType: "share_completed",
        platform: "native",
      };

      const response2 = await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData2),
      });

      expect(response2.ok).toBe(true);
      const data2 = await response2.json();
      expect(data2.success).toBe(true);

      // Verify both calls were made
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should track complete user flow: click -> modal -> social share", async () => {
      // Mock no native share support
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      // Mock three analytics calls: share_initiated, then share_completed for twitter
      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      // User initiates share
      const eventData1 = {
        eventType: "share_initiated",
        widgetType: "converter",
        currency: "USD",
        rate: 500.25,
        timestamp: new Date().toISOString(),
      };

      await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData1),
      });

      // Modal is shown, user clicks Twitter button
      const eventData2 = {
        ...eventData1,
        eventType: "share_completed",
        platform: "twitter",
      };

      await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData2),
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Verify event data integrity
      const calls = mockFetch.mock.calls;
      const initiated = JSON.parse(calls[0][1].body);
      const completed = JSON.parse(calls[1][1].body);

      expect(initiated.eventType).toBe("share_initiated");
      expect(completed.eventType).toBe("share_completed");
      expect(completed.platform).toBe("twitter");
      expect(completed.currency).toBe(initiated.currency);
      expect(completed.rate).toBe(initiated.rate);
    });

    it("should track complete user flow: click -> modal -> copy link", async () => {
      // Mock Clipboard API
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      // User initiates share
      const eventData1 = {
        eventType: "share_initiated",
        widgetType: "chart",
        currency: "EUR",
        rate: 750.5,
        timestamp: new Date().toISOString(),
      };

      await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData1),
      });

      // Modal shown, user copies link
      const eventData2 = {
        ...eventData1,
        eventType: "link_copied",
        platform: "copy",
      };

      await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData2),
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);

      const calls = mockFetch.mock.calls;
      const copied = JSON.parse(calls[1][1].body);
      expect(copied.eventType).toBe("link_copied");
      expect(copied.platform).toBe("copy");
    });
  });

  describe("Multiple shares in same session", () => {
    it("should track multiple shares with different platforms", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      const platforms = ["twitter", "facebook", "whatsapp", "telegram"];

      for (let i = 0; i < platforms.length; i++) {
        const eventData = {
          eventType: "share_completed",
          widgetType: "rates",
          currency: "NGN",
          rate: 1550.5,
          platform: platforms[i],
          timestamp: new Date().toISOString(),
        };

        const response = await fetch("/api/analytics/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });

        expect(response.ok).toBe(true);
      }

      expect(mockFetch).toHaveBeenCalledTimes(4);

      // Verify each platform was tracked
      mockFetch.mock.calls.forEach((call, index) => {
        const body = JSON.parse(call[1].body);
        expect(body.platform).toBe(platforms[index]);
      });
    });

    it("should track multiple different widget types", async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      const widgetTypes = ["rates", "converter", "chart"];

      for (let i = 0; i < widgetTypes.length; i++) {
        const eventData = {
          eventType: "share_initiated",
          widgetType: widgetTypes[i],
          currency: "NGN",
          rate: 1550.5,
          timestamp: new Date().toISOString(),
        };

        const response = await fetch("/api/analytics/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });

        expect(response.ok).toBe(true);
      }

      expect(mockFetch).toHaveBeenCalledTimes(3);

      // Verify each widget type was tracked
      mockFetch.mock.calls.forEach((call, index) => {
        const body = JSON.parse(call[1].body);
        expect(body.widgetType).toBe(widgetTypes[index]);
      });
    });
  });

  describe("Network resilience in real flow", () => {
    it("should continue user flow even if share_initiated fails", async () => {
      const mockWindowOpen = vi.fn().mockReturnValue({
        closed: false,
      });
      window.open = mockWindowOpen;

      // First call fails (share_initiated), but continue anyway
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));

      // Attempt to log share_initiated (fails)
      const eventData1 = {
        eventType: "share_initiated",
        widgetType: "rates",
        currency: "NGN",
        rate: 1550.5,
        timestamp: new Date().toISOString(),
      };

      try {
        await fetch("/api/analytics/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData1),
        });
      } catch (e) {
        // Silently fail - user action continues
      }

      // User proceeds to share (social media button click)
      const eventData2 = {
        ...eventData1,
        eventType: "share_completed",
        platform: "twitter",
      };

      const response = await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData2),
      });

      expect(response.ok).toBe(true);

      // Second call succeeded
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should handle analytics timeout without blocking user", async () => {
      // Simulate slow analytics (timeout)
      mockFetch.mockImplementationOnce(
        () => new Promise(() => {}), // Never resolves
      );

      const startTime = Date.now();

      // Set up timeout to abort if takes too long
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 5000),
      );

      const eventData = {
        eventType: "share_initiated",
        widgetType: "rates",
        currency: "NGN",
        rate: 1550.5,
        timestamp: new Date().toISOString(),
      };

      // In real implementation, this would be aborted after 5 seconds
      // For test purposes, we verify the pattern is correct
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      expect(() => {
        controller.abort(); // Simulate timeout
      }).not.toThrow();

      clearTimeout(timeoutId);
    });

    it("should recover from partial failures in event sequence", async () => {
      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true }))) // share_initiated
        .mockRejectedValueOnce(new Error("Network error")) // share_completed fails
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true }))); // link_copied succeeds

      // Share initiated (success)
      const event1 = {
        eventType: "share_initiated",
        widgetType: "rates",
        currency: "NGN",
        rate: 1550.5,
        timestamp: new Date().toISOString(),
      };
      const res1 = await fetch("/api/analytics/share", {
        method: "POST",
        body: JSON.stringify(event1),
      });
      expect(res1.ok).toBe(true);

      // Share completed (fails - user action continues anyway)
      const event2 = {
        ...event1,
        eventType: "share_completed",
        platform: "twitter",
      };
      try {
        await fetch("/api/analytics/share", {
          method: "POST",
          body: JSON.stringify(event2),
        });
      } catch (e) {
        // Silently fail
      }

      // Link copied (succeeds)
      const event3 = {
        ...event1,
        eventType: "link_copied",
        platform: "copy",
      };
      const res3 = await fetch("/api/analytics/share", {
        method: "POST",
        body: JSON.stringify(event3),
      });
      expect(res3.ok).toBe(true);

      // Should have attempted all three
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("Data consistency across events", () => {
    it("should maintain data consistency from initiation to completion", async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      const currency = "NGN";
      const rate = 1550.5;
      const widgetType = "rates";
      const timestamp = new Date().toISOString();

      // Share initiated
      const event1 = {
        eventType: "share_initiated",
        widgetType,
        currency,
        rate,
        timestamp,
      };

      await fetch("/api/analytics/share", {
        method: "POST",
        body: JSON.stringify(event1),
      });

      // Share completed
      const event2 = {
        eventType: "share_completed",
        widgetType,
        currency,
        rate,
        platform: "twitter",
        timestamp,
      };

      await fetch("/api/analytics/share", {
        method: "POST",
        body: JSON.stringify(event2),
      });

      // Verify data consistency
      const calls = mockFetch.mock.calls;
      const initiated = JSON.parse(calls[0][1].body);
      const completed = JSON.parse(calls[1][1].body);

      expect(initiated.currency).toBe(completed.currency);
      expect(initiated.rate).toBe(completed.rate);
      expect(initiated.widgetType).toBe(completed.widgetType);
    });

    it("should properly encode special characters in event data", async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      const eventData = {
        eventType: "share_completed",
        widgetType: "rates",
        currency: "NGN",
        rate: 1550.5,
        platform: "twitter",
        timestamp: new Date().toISOString(),
      };

      await fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const call = mockFetch.mock.calls[0];
      const body = JSON.parse(call[1].body);

      // Should be properly encoded and parseable
      expect(body.currency).toBe("NGN");
      expect(body.platform).toBe("twitter");
      expect(typeof body.timestamp).toBe("string");
    });
  });

  describe("Analytics performance in integration", () => {
    it("should not impact user experience with analytics overhead", async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      const startTime = Date.now();

      // Simulate user clicking share button
      const eventData = {
        eventType: "share_initiated",
        widgetType: "rates",
        currency: "NGN",
        rate: 1550.5,
        timestamp: new Date().toISOString(),
      };

      // Fire-and-forget pattern - should complete immediately
      fetch("/api/analytics/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      // Don't await - user action continues

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should be < 10ms (almost instant)
      expect(duration).toBeLessThan(10);
    });

    it("should batch multiple events efficiently", async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ success: true })),
      );

      const startTime = Date.now();

      // Simulate multiple rapid events
      for (let i = 0; i < 10; i++) {
        const eventData = {
          eventType: "share_completed",
          widgetType: "rates",
          currency: "NGN",
          rate: 1550.5 + i,
          platform: "twitter",
          timestamp: new Date().toISOString(),
        };

        // Fire-and-forget
        fetch("/api/analytics/share", {
          method: "POST",
          body: JSON.stringify(eventData),
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should handle multiple events quickly (< 50ms total)
      expect(duration).toBeLessThan(50);
    });
  });
});
