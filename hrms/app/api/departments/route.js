import { NextResponse } from 'next/server';
import {
  initDb,
  Department,
  Employee,
} from '@/lib/db/models/index';

export async function GET() {
  try {
    await initDb();
    const departments = await Department.findAll({
      include: [
        { model: Employee, as: 'employees', attributes: ['id', 'firstName', 'lastName', 'jobTitle', 'status'] },
      ],
      order: [['name', 'ASC']],
    });

    return NextResponse.json({ success: true, departments });
  } catch (error) {
    console.error('Departments GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    const department = await Department.create(body);
    return NextResponse.json({ success: true, department }, { status: 201 });
  } catch (error) {
    console.error('Departments POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
