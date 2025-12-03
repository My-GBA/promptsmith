import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { createToken } from '../../../../lib/server/jwt'
import { verifyTOTP } from '../../../../lib/totp'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { password, code } = body as { password?: string, code?: string }

  const hash = process.env.ADMIN_PASSWORD_HASH
  const plain = process.env.ADMIN_PASSWORD
  const totpSecret = process.env.ADMIN_TOTP_SECRET

  if (!(hash || plain) || !totpSecret) {
    return NextResponse.json({ ok: false, error: 'Server admin not configured' }, { status: 500 })
  }

  // verify password
  let passOk = false
  if (hash) passOk = await bcrypt.compare(password || '', hash)
  else passOk = (password || '') === plain

  if (!passOk) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })

  // verify 2FA
  const totpOk = await verifyTOTP(totpSecret, code || '')
  if (!totpOk) return NextResponse.json({ ok: false, error: 'Invalid 2FA' }, { status: 401 })

  const token = await createToken({ role: 'admin' })
  cookies().set('admin_session', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60*60*24*7 })
  return NextResponse.json({ ok: true })
}
