import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "alerts.json");

// Ensure data directory exists
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE))
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Simple in-memory rate limiter per user/email within this server instance
// key -> { count, windowStart }
// limit: 50 alerts per 24 hours per user
const LIMIT_COUNT = Number(process.env.ALERT_SERVER_LIMIT || 50);
const WINDOW_MS = Number(
  process.env.ALERT_SERVER_WINDOW_MS || 24 * 60 * 60 * 1000
);
// @ts-ignore
if (!(globalThis as any).__NAIRAMET_ALERT_RATE)
  (globalThis as any).__NAIRAMET_ALERT_RATE = {};
// @ts-ignore
const RATE = (globalThis as any).__NAIRAMET_ALERT_RATE as Record<
  string,
  { count: number; windowStart: number }
>;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user = url.searchParams.get("user") || "";
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const items = JSON.parse(raw || "[]");
    if (user) {
      const filtered = items.filter(
        (a: any) => a.userId === user || a.userEmail === user
      );
      return NextResponse.json({ alerts: filtered });
    }
    return NextResponse.json({ alerts: items });
  } catch (err) {
    console.error("Alerts GET error", err);
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // Basic server-side validation
    const {
      userEmail,
      currency,
      rateType,
      condition,
      threshold,
      isActive = true,
      data,
    } = payload || {};
    if (
      !userEmail ||
      !currency ||
      !rateType ||
      !condition ||
      typeof threshold !== "number"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Rate limit
    const key = `alerts:${userEmail}`;
    const now = Date.now();
    const entry = RATE[key] || { count: 0, windowStart: now };
    if (now - entry.windowStart > WINDOW_MS) {
      entry.count = 0;
      entry.windowStart = now;
    }
    if (entry.count >= LIMIT_COUNT) {
      return NextResponse.json(
        { error: "Alert limit reached" },
        { status: 429 }
      );
    }
    entry.count += 1;
    RATE[key] = entry;

    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const items = JSON.parse(raw || "[]");

    const newAlert = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      userId: userEmail,
      userEmail,
      currency: currency.toUpperCase(),
      rateType,
      condition,
      threshold,
      isActive: !!isActive,
      data: data || {},
      createdAt: new Date().toISOString(),
    };

    items.push(newAlert);
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));

    return NextResponse.json({ alert: newAlert });
  } catch (err) {
    console.error("Alerts POST error", err);
    return NextResponse.error();
  }
}
