import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../../lib/server/jwt'

export async function GET() {
  const token = cookies().get('admin_session')?.value
  if (!token) return NextResponse.json({ authenticated: false })
  try {
    await verifyToken(token)
    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
