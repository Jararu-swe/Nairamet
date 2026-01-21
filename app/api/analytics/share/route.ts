import { NextRequest, NextResponse } from 'next/server';

/**
 * Share analytics event interface
 */
interface ShareEvent {
  eventType: 'share_initiated' | 'share_completed' | 'link_copied';
  widgetType: 'rates' | 'converter' | 'chart';
  currency: string;
  rate: number;
  platform?: 'native' | 'twitter' | 'facebook' | 'whatsapp' | 'telegram' | 'copy';
  timestamp: string;
}

/**
 * Validates share event data
 */
function isValidShareEvent(data: any): data is ShareEvent {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const validEventTypes = ['share_initiated', 'share_completed', 'link_copied'];
  const validWidgetTypes = ['rates', 'converter', 'chart'];
  const validPlatforms = ['native', 'twitter', 'facebook', 'whatsapp', 'telegram', 'copy'];

  return (
    validEventTypes.includes(data.eventType) &&
    validWidgetTypes.includes(data.widgetType) &&
    typeof data.currency === 'string' &&
    data.currency.length > 0 &&
    typeof data.rate === 'number' &&
    !isNaN(data.rate) &&
    typeof data.timestamp === 'string' &&
    (!data.platform || validPlatforms.includes(data.platform))
  );
}

/**
 * POST /api/analytics/share
 * Logs share analytics events
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body with timeout
    const body = await Promise.race([
      request.json(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      )
    ]);

    // Validate event data
    if (!isValidShareEvent(body)) {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      );
    }

    const event: ShareEvent = body;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Share Analytics]', {
        type: event.eventType,
        widget: event.widgetType,
        currency: event.currency,
        platform: event.platform,
        timestamp: event.timestamp,
      });
    }

    // TODO: Store in database or analytics service
    // For now, we just acknowledge receipt
    // In production, you would:
    // - Store in a database (Prisma, Supabase, etc.)
    // - Send to analytics service (Google Analytics, Mixpanel, etc.)
    // - Queue for batch processing
    
    // Example database storage (commented out):
    // await prisma.shareEvent.create({
    //   data: {
    //     eventType: event.eventType,
    //     widgetType: event.widgetType,
    //     currency: event.currency,
    //     rate: event.rate,
    //     platform: event.platform,
    //     timestamp: new Date(event.timestamp),
    //   },
    // });

    return NextResponse.json(
      { success: true, message: 'Event logged' },
      { status: 200 }
    );
  } catch (error) {
    // Log error but don't expose details to client
    console.error('[Share Analytics Error]', error);

    // Return success even on error to avoid blocking client
    // Analytics failures should be silent from user perspective
    return NextResponse.json(
      { success: true, message: 'Event received' },
      { status: 200 }
    );
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
