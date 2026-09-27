import { NextResponse } from 'next/server';
import { readStore, addLog } from '@/lib/storage';
import { syncProductsToAdmin } from '@/lib/adminPoster';
import { ProductItem } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const store = readStore();

    if (store.isSyncingActive) {
      return NextResponse.json({ error: 'Sync operation is already in progress.' }, { status: 400 });
    }

    let productsToSync: ProductItem[] = [];

    if (body.productIds && Array.isArray(body.productIds) && body.productIds.length > 0) {
      productsToSync = store.products.filter((p) => body.productIds.includes(p.id));
    } else {
      // Sync approved or pending items
      productsToSync = store.products.filter((p) => p.status === 'approved' || p.status === 'pending');
    }

    if (productsToSync.length === 0) {
      return NextResponse.json({ error: 'No eligible products found to sync.' }, { status: 400 });
    }

    // Launch synchronization in the background
    (async () => {
      try {
        await syncProductsToAdmin(productsToSync, store.adminConfig);
      } catch (err: any) {
        addLog('error', `Admin sync background execution error: ${err.message}`);
      }
    })();

    return NextResponse.json({
      message: `Started auto-posting ${productsToSync.length} products to Admin Panel.`,
      count: productsToSync.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
