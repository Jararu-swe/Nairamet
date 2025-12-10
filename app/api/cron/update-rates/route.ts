import { NextResponse } from "next/server";

/**
 * Cron job to update currency rates every hour
 */
export async function GET(request: Request) {
  try {
    const currencyRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/currency`,
      { cache: 'no-store' }
    );
    const currencyData = await currencyRes.json();
    
    console.log('[Cron] Currency rates updated successfully');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: currencyData,
    });
  } catch (error) {
    console.error('[Cron] Currency update failed:', error);
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: String(error),
      },
      { status: 500 }
    );
  }
}
