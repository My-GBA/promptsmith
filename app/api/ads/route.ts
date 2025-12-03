import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../lib/server/jwt'
import { initAdsTable, listActiveAds, createAd } from '../../../lib/db'

function getDefaultAd() {
  const enabled = process.env.DEFAULT_AD_ENABLED === 'true'
  if (!enabled) return null
  const title = process.env.DEFAULT_AD_TITLE || 'Découvrez PromptSmith Pro'
  const description = process.env.DEFAULT_AD_DESCRIPTION || 'Créez des prompts ultra-optimisés et boostez votre productivité.'
  const mediaType = (process.env.DEFAULT_AD_MEDIA_TYPE as 'image'|'video') || 'image'
  const mediaUrl = process.env.DEFAULT_AD_MEDIA_URL || 'https://images.unsplash.com/photo-1556767576-c452e96f22d0?w=1200&q=80&auto=format&fit=crop'
  const targetLink = process.env.DEFAULT_AD_TARGET_LINK || 'https://promptsmith.example.com/pro'
  const buttonText = process.env.DEFAULT_AD_BUTTON_TEXT || 'En savoir plus'

  return {
    id: 'default-ad',
    title,
    description,
    media_type: mediaType,
    media_url: mediaUrl,
    target_link: targetLink,
    button_text: buttonText,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

export async function GET() {
  await initAdsTable()
  const ads = await listActiveAds()
  if (ads.length === 0) {
    const fallback = getDefaultAd()
    if (fallback) return NextResponse.json({ ads: [fallback] })
  }
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
