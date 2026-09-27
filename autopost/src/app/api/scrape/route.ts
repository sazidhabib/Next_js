import { NextResponse } from 'next/server';
import { updateScraperConfig, readStore, addLog } from '@/lib/storage';
import { runScraper } from '@/lib/scraper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = readStore();

    if (current.isScrapingActive) {
      return NextResponse.json({ error: 'Scraping is already running.' }, { status: 400 });
    }

    // Update config if provided
    const newConfig = {
      ...current.scraperConfig,
      ...(body.targetUrl ? { targetUrl: body.targetUrl } : {}),
      ...(body.priorityCategories ? { priorityCategories: body.priorityCategories } : {}),
      ...(body.maxProductsPerCategory !== undefined ? { maxProductsPerCategory: Number(body.maxProductsPerCategory) } : {}),
      ...(body.downloadImages !== undefined ? { downloadImages: Boolean(body.downloadImages) } : {}),
    };

    updateScraperConfig(newConfig);

    // Run scraper asynchronously in the background so the UI doesn't hang
    (async () => {
      try {
        await runScraper(newConfig);
      } catch (err: any) {
        addLog('error', `Scraper background execution error: ${err.message}`);
      }
    })();

    return NextResponse.json({
      message: 'Scraping agent initiated.',
      config: newConfig,
    });
  } catch (err: any) {
    console.error('Scrape route error:', err);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
