import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { readSiteConfig, updateSiteConfig } from '@/lib/site-storage';

export async function GET() {
  return NextResponse.json({ site: await readSiteConfig() });
}

export async function PUT(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  if (!verifyAdminToken(auth.replace('Bearer ', ''))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = await request.json();
  if (!body.profileImage) {
    return NextResponse.json({ error: 'profileImage is required.' }, { status: 400 });
  }

  try {
    const site = await updateSiteConfig({ profileImage: String(body.profileImage) });
    return NextResponse.json({ site });
  } catch {
    return NextResponse.json({ error: 'Unable to save site config.' }, { status: 500 });
  }
}
