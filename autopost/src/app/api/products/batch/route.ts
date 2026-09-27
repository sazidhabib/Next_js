import { NextResponse } from 'next/server';
import { readStore, writeStore, clearProducts } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { action, productIds } = await req.json();
    const store = readStore();

    if (action === 'approve_all') {
      store.products = store.products.map((p) => (p.status === 'pending' ? { ...p, status: 'approved' } : p));
      writeStore(store);
      return NextResponse.json({ message: 'All pending products approved.' });
    }

    if (action === 'approve_selected' && Array.isArray(productIds)) {
      store.products = store.products.map((p) => (productIds.includes(p.id) ? { ...p, status: 'approved' } : p));
      writeStore(store);
      return NextResponse.json({ message: 'Selected products approved.' });
    }

    if (action === 'delete_selected' && Array.isArray(productIds)) {
      store.products = store.products.filter((p) => !productIds.includes(p.id));
      writeStore(store);
      return NextResponse.json({ message: 'Selected products removed.' });
    }

    if (action === 'clear_all') {
      clearProducts();
      return NextResponse.json({ message: 'All staged products removed.' });
    }

    if (action === 'reset_all') {
      store.products = store.products.map((p) => ({ ...p, status: 'pending', errorMessage: undefined }));
      writeStore(store);
      return NextResponse.json({ message: 'All products reset to pending.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
