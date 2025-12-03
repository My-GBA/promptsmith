import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../../lib/server/jwt'
import { initAdsTable, updateAd, deleteAd } from '../../../../lib/db'

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return false
  try { await verifyToken(token); return true } catch { return false }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })

  // Vérifier si la base de données est configurée
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({
      ok: false,
      error: 'Database not configured'
    }, { status: 503 })
  }

  try {
    await initAdsTable()
    const body = await req.json()
    const updated = await updateAd(params.id, {
      title: body.title,
      description: body.description,
      media_type: body.mediaType,
      media_url: body.mediaUrl,
      target_link: body.targetLink,
      button_text: body.buttonText,
      is_active: body.isActive
    })
    return NextResponse.json({ ok: true, ad: updated })
  } catch (error) {
    console.error('❌ Erreur PUT /api/ads/[id]:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })

  // Ne supprime pas la publicité par défaut (fallback), c'est un artefact côté client
  if (params.id === 'default-ad') {
    // Répondre OK sans action pour éviter les erreurs 500 côté client
    return NextResponse.json({ ok: true, skipped: true })
  }

  // Vérifier si la base de données est configurée
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({
      ok: false,
      error: 'Database not configured'
    }, { status: 503 })
  }

  try {
    await initAdsTable()
    await deleteAd(params.id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Erreur DELETE /api/ads/[id]:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
