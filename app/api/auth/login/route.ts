import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { createToken } from '../../../../lib/server/jwt'
import { verifyTOTP } from '../../../../lib/totp'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { password, code } = body as { password?: string, code?: string }

  const hash = process.env.ADMIN_PASSWORD_HASH
  const totpSecret = process.env.ADMIN_TOTP_SECRET

  // SÉCURITÉ : Avertir si ADMIN_PASSWORD est défini (non recommandé)
  if (process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_PASSWORD should not be used. Use ADMIN_PASSWORD_HASH instead.')
  }

  // Validation des variables d'environnement
  if (!hash || !totpSecret) {
    return NextResponse.json({ ok: false, error: 'Server admin not configured' }, { status: 500 })
  }

  // Verify password (utilise uniquement le hash bcrypt)
  const passOk = await bcrypt.compare(password || '', hash)
  if (!passOk) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })

  // Verify 2FA
  const totpOk = await verifyTOTP(totpSecret, code || '')
  if (!totpOk) return NextResponse.json({ ok: false, error: 'Invalid 2FA' }, { status: 401 })

  const token = await createToken({ role: 'admin' })
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60*60*24*7 })
  return NextResponse.json({ ok: true })
}
