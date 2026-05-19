import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'missing id' }, { status: 400 });

  // In a full implementation this would query DB/payment gateway state.
  // Here we return a placeholder response.
  return NextResponse.json({ ok: true, data: { id, status: 'PENDING' } });
}
