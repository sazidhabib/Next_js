import { NextResponse } from 'next/server';
import {
  toggleItemAvailability,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/dataStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, itemId, categoryId, itemData, categoryData, restaurantId } = body;

    // 1. Toggle Item Availability
    if (action === 'toggle-availability') {
      const item = await toggleItemAvailability(itemId);
      if (!item) {
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: item });
    }

    // 2. Add New Category
    if (action === 'add-category') {
      if (!categoryData?.name) {
        return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
      }
      const newCategory = await addCategory(restaurantId, categoryData);
      return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
    }

    // 3. Update Category
    if (action === 'update-category') {
      if (!categoryId) {
        return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
      }
      const updatedCat = await updateCategory(categoryId, categoryData);
      return NextResponse.json({ success: true, data: updatedCat });
    }

    // 4. Delete Category
    if (action === 'delete-category') {
      if (!categoryId) {
        return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
      }
      await deleteCategory(categoryId);
      return NextResponse.json({ success: true, message: 'Category deleted' });
    }

    // 5. Add Menu Item (Dish)
    if (action === 'add-item') {
      if (!categoryId || !itemData?.name || itemData?.basePrice === undefined) {
        return NextResponse.json({ success: false, error: 'Missing required dish fields' }, { status: 400 });
      }
      const newItem = await addMenuItem(categoryId, itemData);
      if (!newItem) {
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 400 });
      }
      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    }

    // 6. Update Menu Item (Dish)
    if (action === 'update-item') {
      if (!itemId) {
        return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
      }
      const updatedItem = await updateMenuItem(itemId, itemData);
      return NextResponse.json({ success: true, data: updatedItem });
    }

    // 7. Delete Menu Item (Dish)
    if (action === 'delete-item') {
      if (!itemId) {
        return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
      }
      await deleteMenuItem(itemId);
      return NextResponse.json({ success: true, message: 'Item deleted' });
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
