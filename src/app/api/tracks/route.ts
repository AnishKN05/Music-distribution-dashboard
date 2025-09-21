import { NextResponse } from 'next/server';
import { getTracks, addTrack } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(getTracks());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, artist, genre, releaseDate } = body as {
      title?: string; artist?: string; genre?: string; releaseDate?: string;
    };

    if (!title || !artist || !genre || !releaseDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = addTrack({ title, artist, genre, releaseDate });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 });
  }
}
