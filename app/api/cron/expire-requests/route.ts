import { NextResponse, type NextRequest } from 'next/server';
import { processExpiredRequests } from '@/lib/services/request-expiry';

export async function GET(request: NextRequest) {
  // Verifikasi Bearer Token Cron Secret jika dikonfigurasi
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processExpiredRequests();
    return NextResponse.json({
      success: true,
      processed_at: new Date().toISOString(),
      ...result,
    });
  } catch (err: unknown) {
    console.error('Error in expire-requests cron route:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
