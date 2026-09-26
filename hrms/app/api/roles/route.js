import { NextResponse } from 'next/server';
import {
  initDb,
  Role,
  User,
} from '@/lib/db/models/index';

export async function GET() {
  try {
    await initDb();
    const roles = await Role.findAll({
      include: [{ model: User, as: 'users', attributes: ['id', 'name', 'email'] }],
      order: [['id', 'ASC']],
    });
    return NextResponse.json({ success: true, roles });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const role = await Role.create(body);
    return NextResponse.json({ success: true, role }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
