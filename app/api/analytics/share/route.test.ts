import { POST } from "./route";
import { NextRequest } from "next/server";

/**
 * Test suite for share analytics endpoint
 * Tests validation, event logging, and error handling
 */
describe("POST /api/analytics/share", () => {
  // Mock valid share event
  const validShareEvent = {
    eventType: "share_initiated" as const,
    widgetType: "rates" as const,
    currency: "NGN",
    rate: 1550.5,
    timestamp: new Date().toISOString(),
  };

  const validShareEventWithPlatform = {
    ...validShareEvent,
    eventType: "share_completed" as const,
    platform: "twitter" as const,
  };

  const validLinkCopiedEvent = {
    ...validShareEvent,
    eventType: "link_copied" as const,
    platform: "copy" as const,
  };

  describe("Valid event data", () => {
    it("should accept share_initiated event", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(validShareEvent),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({
        success: true,
        message: "Event logged",
      });
    });

    it("should accept share_completed event with platform", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(validShareEventWithPlatform),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should accept link_copied event", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(validLinkCopiedEvent),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should accept all valid widget types", async () => {
      const widgetTypes = ["rates", "converter", "chart"];

      for (const widgetType of widgetTypes) {
        const request = new NextRequest(
          "http://localhost:3000/api/analytics/share",
          {
            method: "POST",
            body: JSON.stringify({
              ...validShareEvent,
              widgetType,
            }),
          },
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it("should accept all valid platforms", async () => {
      const platforms = [
        "native",
        "twitter",
        "facebook",
        "whatsapp",
        "telegram",
        "copy",
      ];

      for (const platform of platforms) {
        const request = new NextRequest(
          "http://localhost:3000/api/analytics/share",
          {
            method: "POST",
            body: JSON.stringify({
              ...validShareEvent,
              eventType: "share_completed",
              platform,
            }),
          },
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it("should accept different currencies", async () => {
      const currencies = ["NGN", "USD", "EUR", "GBP", "CAD"];

      for (const currency of currencies) {
        const request = new NextRequest(
          "http://localhost:3000/api/analytics/share",
          {
            method: "POST",
            body: JSON.stringify({
              ...validShareEvent,
              currency,
            }),
          },
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it("should accept various exchange rates", async () => {
      const rates = [0.5, 1, 100, 1550.5, 10000.25, 999999.99];

      for (const rate of rates) {
        const request = new NextRequest(
          "http://localhost:3000/api/analytics/share",
          {
            method: "POST",
            body: JSON.stringify({
              ...validShareEvent,
              rate,
            }),
          },
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });
  });

  describe("Invalid event data", () => {
    it("should reject invalid event type", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            eventType: "invalid_event",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe("Invalid event data");
    });

    it("should reject invalid widget type", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            widgetType: "invalid_widget",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe("Invalid event data");
    });

    it("should reject missing currency", async () => {
      const { currency, ...eventWithoutCurrency } = validShareEvent;

      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(eventWithoutCurrency),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject empty currency string", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            currency: "",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject missing rate", async () => {
      const { rate, ...eventWithoutRate } = validShareEvent;

      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(eventWithoutRate),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject invalid rate (NaN)", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            rate: NaN,
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject invalid rate (non-number)", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            rate: "not-a-number",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject missing timestamp", async () => {
      const { timestamp, ...eventWithoutTimestamp } = validShareEvent;

      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(eventWithoutTimestamp),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject invalid platform", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            eventType: "share_completed",
            platform: "invalid_platform",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject null body", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(null),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject non-object body", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify("not an object"),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject empty object", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe("Platform data accuracy", () => {
    it("share_completed event should include platform for native share", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            eventType: "share_completed",
            platform: "native",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("share_completed event should include platform for social media", async () => {
      const platforms = ["twitter", "facebook", "whatsapp", "telegram"];

      for (const platform of platforms) {
        const request = new NextRequest(
          "http://localhost:3000/api/analytics/share",
          {
            method: "POST",
            body: JSON.stringify({
              ...validShareEvent,
              eventType: "share_completed",
              platform,
            }),
          },
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it("link_copied event should have copy platform", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            eventType: "link_copied",
            platform: "copy",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("share_initiated should not require platform", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({
            ...validShareEvent,
            eventType: "share_initiated",
          }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe("Error handling", () => {
    it("should handle malformed JSON", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: "{invalid json}",
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it("should handle request timeout gracefully", async () => {
      // Note: This test depends on implementation handling slow requests
      // In real scenario, implement a timeout in the route handler
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(validShareEvent),
        },
      );

      const response = await POST(request);
      // Should either succeed or return an error, not hang
      expect([200, 400, 500]).toContain(response.status);
    });

    it("should not expose internal error details", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: "{invalid}",
        },
      );

      const response = await POST(request);
      const data = await response.json();

      // Should not expose stack traces or internal details
      expect(data.stack).toBeUndefined();
      expect(data.message).not.toContain("at ");
    });
  });

  describe("Response format", () => {
    it("should return JSON response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(validShareEvent),
        },
      );

      const response = await POST(request);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should return success: true on valid event", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(validShareEvent),
        },
      );

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toBe("Event logged");
    });

    it("should return error message on invalid event", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
      );

      const response = await POST(request);
      const data = await response.json();

      expect(data.error).toBeDefined();
      expect(data.error).toBe("Invalid event data");
    });
  });

  describe("Non-blocking behavior", () => {
    it("should return 200 immediately regardless of storage", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/share",
        {
          method: "POST",
          body: JSON.stringify(validShareEvent),
        },
      );

      const startTime = Date.now();
      const response = await POST(request);
      const endTime = Date.now();

      // Should return quickly (within 100ms) without waiting for async operations
      expect(endTime - startTime).toBeLessThan(100);
      expect(response.status).toBe(200);
    });
  });
});
