import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'PromptSmith',
  description: 'Générateur de prompts - PromptSmith',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
