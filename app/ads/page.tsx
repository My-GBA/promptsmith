// Redirection vers la page advertisements avec vérification d'authentification
"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'

export default function AdsPage() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'authentification
    const isAuth = sessionStorage.getItem('admin_authenticated')
    
    if (isAuth === 'true') {
      // Authentifié - rediriger vers advertisements
      router.replace('/advertisements')
    } else {
      // Non authentifié - rediriger vers login
      router.replace('/admin-login')
    }
  }, [router])

  // Afficher un loader pendant la vérification
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Vérification...</p>
      </div>
    </div>
  )
}
