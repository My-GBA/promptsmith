"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useStore from '../../lib/store'
import { verifyTOTP } from '../../lib/totp'

export default function AdminLoginPage() {
  const router = useRouter()
  const language = useStore(s => s.language)
  const [step, setStep] = useState<'password' | '2fa'>('password')
  const [password, setPassword] = useState('')
  const [code2FA, setCode2FA] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasConfig, setHasConfig] = useState(false)
  const OWNER_CODE = process.env.NEXT_PUBLIC_SETUP_CODE || ''

  // Vérifier si déjà authentifié et si config existe
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated')
    if (isAuth === 'true') {
      router.push('/ads')
      return
    }

    // Vérifier si les identifiants sont configurés
    const adminPassword = localStorage.getItem('admin_password')
    const admin2FA = localStorage.getItem('admin_2fa_secret')

    if (!adminPassword || !admin2FA) {
      // Pas de configuration : ne pas permettre la création sans code propriétaire
      setError(language === 'fr' 
        ? 'Accès refusé. Configuration admin réservée au propriétaire.'
        : 'Access denied. Admin setup is owner-only.')
      setHasConfig(false)
    } else {
      setHasConfig(true)
    }
  }, [router])

  // Étape 1 : Vérifier le mot de passe
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const savedPassword = localStorage.getItem('admin_password')
      
      if (password === savedPassword) {
        setStep('2fa')
        setError('')
      } else {
        setError(language === 'fr' ? 'Mot de passe incorrect' : 'Incorrect password')
      }
      setLoading(false)
    }, 500)
  }

  // Étape 2 : Vérifier le code 2FA
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const secret = localStorage.getItem('admin_2fa_secret')
      if (!secret) {
        setError('Configuration 2FA manquante')
        setLoading(false)
        return
      }

      // Vérifier le code TOTP
      const isValid = await verifyTOTP(secret, code2FA)
      
      if (isValid) {
        // Authentification réussie
        sessionStorage.setItem('admin_authenticated', 'true')
        router.push('/ads')
      } else {
        setError(language === 'fr' ? 'Code 2FA incorrect' : 'Incorrect 2FA code')
      }
    } catch (err) {
      setError('Erreur lors de la vérification')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center p-4">
      {!hasConfig ? (
        <div className="text-center">
          <div className="rounded-lg p-6 bg-red-500/10 border border-red-500/30 inline-block mb-4">🚫</div>
          <p className="text-slate-400 max-w-sm">{language === 'fr' ? 'Accès refusé. Seul le propriétaire du site peut configurer un compte administrateur.' : 'Access denied. Only the site owner can configure an admin account.'}</p>
          <p className="text-slate-500 text-xs mt-2">{language === 'fr' ? 'Si vous êtes le propriétaire, ouvrez /admin-setup?code=VOTRE_CODE' : 'If you are the owner, open /admin-setup?code=YOUR_CODE'}</p>
        </div>
      ) : (
        <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/settings" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← {language === 'fr' ? 'Retour aux paramètres' : 'Back to settings'}
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            🔐 {language === 'fr' ? 'Authentification Administrateur' : 'Admin Authentication'}
          </h1>
          <p className="text-slate-400">
            {step === 'password' 
              ? (language === 'fr' ? 'Étape 1/2 : Mot de passe' : 'Step 1/2: Password')
              : (language === 'fr' ? 'Étape 2/2 : Code 2FA' : 'Step 2/2: 2FA Code')
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
          {step === 'password' ? (
            // Étape 1 : Mot de passe
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  🔑 {language === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'fr' ? 'Entrez le mot de passe' : 'Enter password'}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-lg font-bold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? '⏳' : '➡️'} {language === 'fr' ? 'Continuer' : 'Continue'}
              </button>
            </form>
          ) : (
            // Étape 2 : Code 2FA
            <form onSubmit={handle2FASubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  📱 {language === 'fr' ? 'Code à 6 chiffres' : '6-digit code'}
                </label>
                <input
                  type="text"
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white text-center text-2xl font-mono tracking-widest placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                  maxLength={6}
                  required
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  {language === 'fr' 
                    ? 'Entrez le code de votre application d\'authentification'
                    : 'Enter the code from your authenticator app'
                  }
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('password')
                    setCode2FA('')
                    setError('')
                  }}
                  className="px-6 py-4 bg-slate-800/50 border border-purple-500/30 hover:border-purple-500/60 text-slate-300 hover:text-purple-400 rounded-lg font-bold transition-all duration-200"
                >
                  ← {language === 'fr' ? 'Retour' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={loading || code2FA.length !== 6}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-lg font-bold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50"
                >
                  {loading ? '⏳' : '🔓'} {language === 'fr' ? 'Vérifier' : 'Verify'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info Security */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>
            🛡️ {language === 'fr' 
              ? 'Authentification à double facteur pour sécuriser l\'accès'
              : 'Two-factor authentication for secure access'
            }
          </p>
        </div>
      </div>
      )}
    </div>
  )
}
