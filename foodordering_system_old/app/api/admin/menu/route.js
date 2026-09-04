import { NextResponse } from 'next/server';
import { toggleItemAvailability, addMenuItem } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, itemId, categoryId, itemData } = body;

    if (action === 'toggle-availability') {
      const item = toggleItemAvailability(itemId);
      if (!item) {
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: item });
    }

    if (action === 'add-item') {
      const newItem = addMenuItem(categoryId, itemData);
      if (!newItem) {
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 400 });
      }
      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in menu management API:', error);
    return NextResponse.json(
      { success: false, error: 'Menu operation failed' },
      { status: 500 }
    );
  }
}
