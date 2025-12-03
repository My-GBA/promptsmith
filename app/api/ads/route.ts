import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../lib/server/jwt'
import { initAdsTable, listActiveAds, createAd } from '../../../lib/db'

export async function GET() {
  await initAdsTable()
  const ads = await listActiveAds()
  return NextResponse.json({ ads })
}

export async function POST(req: Request) {
  await initAdsTable()
  const token = cookies().get('admin_session')?.value
  if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  try { await verifyToken(token) } catch { return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }) }
  const body = await req.json()
  const ad = await createAd({
    title: body.title,
    description: body.description,
    media_type: body.mediaType,
    media_url: body.mediaUrl,
    target_link: body.targetLink,
    button_text: body.buttonText,
    is_active: body.isActive
  })
  return NextResponse.json({ ok: true, ad })
}
