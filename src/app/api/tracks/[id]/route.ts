import { NextResponse } from 'next/server';
import { getTrackById } from '@/lib/mockData';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const track = getTrackById(params.id);
  if (!track) return NextResponse.json({ error: 'Track not found' }, { status: 404 });
  return NextResponse.json(track);
}
