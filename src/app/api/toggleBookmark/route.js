// app/api/toggleBookmark/route.js
import { toggleBookmark } from '@/utils/bookmark';
import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    const { userId, poemId, stanzaId } = await request.json();
    const result = await toggleBookmark({ userId, poemId, stanzaId });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ message: result.message, data: result.data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
