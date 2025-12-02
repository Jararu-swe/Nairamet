import { NextResponse } from "next/server";

/**
 * Clear all caches - useful for forcing fresh data
 * Usage: curl https://www.nairamet.com/api/admin/clear-cache
 */
export async function GET() {
  try {
    // Clear tracker cache
    // @ts-ignore
    if ((globalThis as any).__NAIRAMET_TRACKER_CACHE) {
      (globalThis as any).__NAIRAMET_TRACKER_CACHE = {};
    }

    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to clear cache",
      },
      { status: 500 }
    );
  }
}
