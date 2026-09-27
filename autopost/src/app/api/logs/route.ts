import { NextResponse } from 'next/server';
import { clearLogs, readStore } from '@/lib/storage';

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.logs);
}

export async function DELETE() {
  clearLogs();
  return NextResponse.json({ message: 'Logs cleared successfully' });
}
