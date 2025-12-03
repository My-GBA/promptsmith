/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Augmente la limite de taille pour les uploads base64
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  // Configuration des routes API
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
    responseLimit: '10mb'
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://*.vercel.app https://api.openai.com; media-src 'self' data: https: blob:;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
