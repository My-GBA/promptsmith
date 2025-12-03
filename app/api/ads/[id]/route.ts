import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../../lib/server/jwt'
import { initAdsTable, updateAd, deleteAd } from '../../../../lib/db'

async function requireAdmin() {
  const token = cookies().get('admin_session')?.value
  if (!token) return false
  try { await verifyToken(token); return true } catch { return false }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await initAdsTable()
  if (!(await requireAdmin())) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })
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
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await initAdsTable()
  if (!(await requireAdmin())) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })
  await deleteAd(params.id)
  return NextResponse.json({ ok: true })
}
