import { NextResponse } from 'next/server';
import { updateAdminConfig, updateScraperConfig, readStore, addLog } from '@/lib/storage';

export async function GET() {
  const store = readStore();
  return NextResponse.json({
    scraperConfig: store.scraperConfig,
    adminConfig: store.adminConfig,
  });
}

export async function POST(req: Request) {
  try {
    const { scraperConfig, adminConfig } = await req.json();

    if (scraperConfig) {
      updateScraperConfig(scraperConfig);
    }
    if (adminConfig) {
      updateAdminConfig(adminConfig);
    }

    addLog('info', 'Agent and Admin settings saved successfully.', 'Settings');
    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
