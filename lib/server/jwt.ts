import { SignJWT, jwtVerify } from 'jose'

const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')
const issuer = 'promptsmith'
const audience = 'admin'

export async function createToken(payload: Record<string, any>, expiresIn = '7d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expiresIn)
    .sign(secretKey)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey, { issuer, audience })
  return payload
}
