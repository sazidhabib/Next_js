import { NextResponse } from 'next/server';
import { ContactMessage, initDb } from '@/lib/models';

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    return NextResponse.json({
      success: true,
      message: 'Message saved successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
