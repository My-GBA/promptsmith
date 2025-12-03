// Utilitaires pour TOTP (Time-based One-Time Password) compatible Google Authenticator
// Génération de code 2FA sans dépendances externes

// Génère un secret aléatoire en base32
export function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)]
  }
  return secret
}

// Décode base32 en bytes
function base32Decode(secret: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  secret = secret.toUpperCase().replace(/=+$/, '')
  
  let bits = ''
  for (let i = 0; i < secret.length; i++) {
    const val = chars.indexOf(secret[i])
    if (val === -1) continue
    bits += val.toString(2).padStart(5, '0')
  }
  
  const bytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, i * 8 + 8), 2)
  }
  return bytes
}

// Génère un HMAC-SHA1 (simplifié pour le navigateur)
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message.buffer as ArrayBuffer)
  return new Uint8Array(signature)
}

// Génère un code TOTP à 6 chiffres
export async function generateTOTP(secret: string, timeStep: number = 30): Promise<string> {
  const key = base32Decode(secret)
  let time = Math.floor(Date.now() / 1000 / timeStep)

  // Convertir le time en bytes (8 octets, big-endian)
  const timeBytes = new Uint8Array(8)
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = time & 0xff
    time = Math.floor(time / 256)
  }
  
  const hmac = await hmacSha1(key, timeBytes)
  
  // Extraction dynamique
  const offset = hmac[hmac.length - 1] & 0xf
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  )
  
  return (code % 1000000).toString().padStart(6, '0')
}

// Vérifie un code TOTP avec une fenêtre de tolérance
export async function verifyTOTP(secret: string, token: string, window: number = 1): Promise<boolean> {
  for (let i = -window; i <= window; i++) {
    const timeStep = 30
    const time = Math.floor(Date.now() / 1000 / timeStep) + i
    const key = base32Decode(secret)
    
    const timeBytes = new Uint8Array(8)
    let t = time
    for (let j = 7; j >= 0; j--) {
      timeBytes[j] = t & 0xff
      t = Math.floor(t / 256)
    }
    
    const hmac = await hmacSha1(key, timeBytes)
    const offset = hmac[hmac.length - 1] & 0xf
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    )
    
    const expectedToken = (code % 1000000).toString().padStart(6, '0')
    if (expectedToken === token) return true
  }
  return false
}

// Génère l'URL pour le QR code Google Authenticator
export function generateQRCodeURL(secret: string, accountName: string = 'PromptSmith', issuer: string = 'PromptSmith Admin'): string {
  const otpauthURL = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthURL)}`
}
