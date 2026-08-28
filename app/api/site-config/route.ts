import { NextResponse } from 'next/server';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { verifyAdminToken } from '@/lib/auth';

const configFilePath = path.join(process.cwd(), 'data', 'site.json');

export async function GET() {
  try {
    const raw = await readFile(configFilePath, 'utf-8');
    const json = JSON.parse(raw);
    return NextResponse.json({ site: json });
  } catch (err) {
    return NextResponse.json({ site: { profileImage: '/profile-illustration.svg' } });
  }
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
    const site = { profileImage: String(body.profileImage) };
    await writeFile(configFilePath, JSON.stringify(site, null, 2), 'utf-8');
    return NextResponse.json({ site });
  } catch (err) {
    return NextResponse.json({ error: 'Unable to save site config.' }, { status: 500 });
  }
}
