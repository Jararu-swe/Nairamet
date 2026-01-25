import { NextResponse } from "next/server";

/**
 * GET /api/metrics/user-count
 * Returns the total number of users who have signed up
 */
export async function GET() {
  try {
    // Try to get user count from database
    // For now, returning a static count that can be updated
    // In production, this would query the database for actual user count

    const userCount = process.env.NEXT_PUBLIC_USER_COUNT || "50000";

    return NextResponse.json({
      success: true,
      count: parseInt(userCount, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Metrics] Error fetching user count:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user count" },
      { status: 500 },
    );
  }
}
