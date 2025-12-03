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
  // Utilise une image data: URI pour éviter les problèmes CORB
  const mediaUrl = process.env.DEFAULT_AD_MEDIA_URL || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(236,72,153);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(139,92,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="600" fill="url(%23grad)" /%3E%3Ctext x="600" y="280" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle"%3EPromptSmith Pro%3C/text%3E%3Ctext x="600" y="340" font-family="Arial, sans-serif" font-size="30" fill="white" text-anchor="middle" opacity="0.9"%3ECréez des prompts ultra-optimisés%3C/text%3E%3C/svg%3E'
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
  try {
    await initAdsTable()
    const ads = await listActiveAds()
    console.log('📊 GET /api/ads - Publicités actives dans DB:', ads.length)
    console.log('📋 Détails des pubs:', JSON.stringify(ads, null, 2))
    
    if (ads.length === 0) {
      console.log('⚠️ Aucune pub active - retour à la pub par défaut')
      const fallback = getDefaultAd()
      if (fallback) return NextResponse.json({ ads: [fallback] })
    }
    
    console.log('✅ Retour des pubs DB (pas de fallback)')
    return NextResponse.json({ ads })
  } catch (error) {
    console.error('❌ Erreur /api/ads GET:', error)
    // Retourne au moins la pub par défaut en cas d'erreur DB
    const fallback = getDefaultAd()
    if (fallback) return NextResponse.json({ ads: [fallback] })
    return NextResponse.json({ ads: [], error: String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await initAdsTable()
    const token = cookies().get('admin_session')?.value
    if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    try { await verifyToken(token) } catch { return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }) }
    const body = await req.json()
    
    console.log('📤 POST /api/ads - Création pub avec données:', {
      title: body.title,
      mediaType: body.mediaType,
      isActive: body.isActive,
      mediaUrlLength: body.mediaUrl?.length || 0
    })
    
    const ad = await createAd({
      title: body.title,
      description: body.description,
      media_type: body.mediaType,
      media_url: body.mediaUrl,
      target_link: body.targetLink,
      button_text: body.buttonText,
      is_active: body.isActive
    })
    
    console.log('✅ Pub créée avec succès, ID:', ad.id)
    return NextResponse.json({ ok: true, ad })
  } catch (error) {
    console.error('❌ Erreur /api/ads POST:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
