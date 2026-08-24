import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { decryptSession } from '@/lib/session';

async function checkSuperAdmin(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  const session = decryptSession(sessionCookie.value);
  if (!session || session.role !== 'SUPER_ADMIN') return null;
  return session;
}

// GET: List all users (including restaurant assignments)
export async function GET(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      include: {
        restaurantRoles: {
          include: {
            restaurant: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new user and assign them to a restaurant if needed
export async function POST(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, phone, restaurantId } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        phone: phone || null,
      },
    });

    // Create UserRestaurantRole link if applicable
    if ((role === 'RESTAURANT_ADMIN' || role === 'STAFF_OPERATOR') && restaurantId) {
      await prisma.userRestaurantRole.create({
        data: {
          userId: newUser.id,
          restaurantId,
          role,
        },
      });
    }

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a user and their restaurant assignment
export async function PUT(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, password, role, phone, restaurantId } = body;

    if (!id || !name || !email || !role) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check duplicate email for other user
    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already in use by another account' }, { status: 400 });
    }

    const updateData = {
      name,
      email,
      role,
      phone: phone || null,
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Clean old restaurant assignments
    await prisma.userRestaurantRole.deleteMany({
      where: { userId: id },
    });

    // Create new restaurant assignment if applicable
    if ((role === 'RESTAURANT_ADMIN' || role === 'STAFF_OPERATOR') && restaurantId) {
      await prisma.userRestaurantRole.create({
        data: {
          userId: id,
          restaurantId,
          role,
        },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a user
export async function DELETE(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self deletion
    if (id === isSuper.userId) {
      return NextResponse.json({ success: false, error: 'You cannot delete your own account' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
