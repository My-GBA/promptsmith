import { SignJWT, jwtVerify } from 'jose'

// Validation de la variable d'environnement en production
const AUTH_SECRET = process.env.AUTH_SECRET
if (!AUTH_SECRET && process.env.NODE_ENV === 'production' && process.env.VERCEL) {
  throw new Error('AUTH_SECRET must be defined in production')
}

const secretKey = new TextEncoder().encode(AUTH_SECRET || 'dev-secret-for-build-only')
const issuer = 'promptsmith'
const audience = 'admin'

// Type pour le payload JWT
export interface TokenPayload {
  role: 'admin'
  iat?: number
  exp?: number
  iss?: string
  aud?: string
  [key: string]: string | number | undefined
}

export async function createToken(payload: TokenPayload, expiresIn = '7d'): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expiresIn)
    .sign(secretKey)
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secretKey, { issuer, audience })
  return payload as TokenPayload
}
