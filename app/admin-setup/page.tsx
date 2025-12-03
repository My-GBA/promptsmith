"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateSecret, generateQRCodeURL } from '../../lib/totp'

export default function AdminSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'check' | 'create' | 'show'>('check')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [secret2FA, setSecret2FA] = useState('')
  const [qrCodeURL, setQrCodeURL] = useState('')
  const [masterPassword, setMasterPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // Code propriétaire (défini via variable d'env NEXT_PUBLIC_SETUP_CODE sur Vercel)
  const OWNER_CODE = process.env.NEXT_PUBLIC_SETUP_CODE || ''

  useEffect(() => {
    // Vérifier si des identifiants existent déjà (côté client uniquement)
    if (typeof window !== 'undefined') {
      const existingPassword = localStorage.getItem('admin_password')
      if (existingPassword) {
        setStep('check')
      }

      // Garde: exiger un code de requête valide pour accéder à la configuration
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code') || ''
      if (!OWNER_CODE || code !== OWNER_CODE) {
        // Bloquer l'accès si le code n'est pas correct
        setError('Accès refusé. Code propriétaire requis.')
      }
    }
  }, [])

  // Vérifier le mot de passe maître
  const handleMasterPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (OWNER_CODE && masterPassword === OWNER_CODE) {
      setStep('create')
      // Générer un nouveau secret 2FA
      const newSecret = generateSecret()
      setSecret2FA(newSecret)
      setQrCodeURL(generateQRCodeURL(newSecret))
    } else {
      setError('Code propriétaire incorrect')
    }
  }

  // Créer les identifiants
  const handleCreateCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('admin_password', password)
    localStorage.setItem('admin_2fa_secret', secret2FA)
    
    setStep('show')
  }

  // Supprimer les identifiants existants (reset)
  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les identifiants admin?')) {
      localStorage.removeItem('admin_password')
      localStorage.removeItem('admin_2fa_secret')
      sessionStorage.removeItem('admin_authenticated')
      setStep('check')
      setPassword('')
      setConfirmPassword('')
      setMasterPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/settings" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Retour aux paramètres
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            ⚙️ Configuration Administrateur
          </h1>
          <p className="text-slate-400">
            {step === 'check' && 'Entrez le mot de passe maître pour configurer'}
            {step === 'create' && 'Créez vos identifiants personnalisés'}
            {step === 'show' && 'Configuration terminée'}
          </p>
        </div>

        {/* Vérifier si config existe déjà */}
        {step === 'check' && (
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            {typeof window !== 'undefined' && localStorage.getItem('admin_password') ? (
              <div className="text-center space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <p className="text-green-400 text-lg font-semibold mb-2">✅ Configuration existante</p>
                  <p className="text-slate-300 text-sm">
                    Vos identifiants sont déjà configurés. Vous pouvez vous connecter via la page de login.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href="/admin-login"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold transition-all text-center"
                  >
                    🔐 Aller à la connexion
                  </Link>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg font-bold transition-all"
                  >
                    🔄 Réinitialiser
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMasterPasswordSubmit} className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-400 text-sm font-semibold mb-1">⚠️ Première configuration</p>
                  <p className="text-slate-300 text-xs">
                    Entrez le mot de passe maître pour créer vos identifiants personnalisés.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    🔑 Mot de passe maître
                  </label>
                  <input
                    type="password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="Mot de passe maître"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Ce code est défini par le propriétaire du site.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold transition-all"
                >
                  ➡️ Continuer
                </button>
              </form>
            )}
          </div>
        )}

        {/* Étape de création */}
        {step === 'create' && (
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <form onSubmit={handleCreateCredentials} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  🔐 Nouveau mot de passe
                </label>
                <div className="flex gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 bg-slate-800/50 border border-purple-500/30 rounded-lg text-slate-300 hover:text-purple-400"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  🔐 Confirmer le mot de passe
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez le mot de passe"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>

              {/* QR Code pour 2FA */}
              <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-3">📱 Configuration Google Authenticator</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Scannez ce QR code avec Google Authenticator pour configurer le 2FA
                </p>
                
                {qrCodeURL && (
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <img src={qrCodeURL} alt="QR Code 2FA" className="w-48 h-48" />
                  </div>
                )}

                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Clé secrète (si scan impossible):</p>
                  <code className="text-purple-400 text-sm font-mono break-all">{secret2FA}</code>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold transition-all"
              >
                💾 Enregistrer la configuration
              </button>
            </form>
          </div>
        )}

        {/* Configuration terminée */}
        {step === 'show' && (
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <div className="text-center space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <p className="text-green-400 text-2xl font-bold mb-2">✅ Configuration réussie!</p>
                <p className="text-slate-300">
                  Vos identifiants ont été enregistrés en toute sécurité.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-left">
                <p className="text-blue-300 text-sm font-semibold mb-2">📝 Informations importantes:</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>✓ Mot de passe enregistré</li>
                  <li>✓ 2FA configuré dans Google Authenticator</li>
                  <li>✓ Vous pouvez maintenant vous connecter</li>
                </ul>
              </div>

              <Link
                href="/admin-login"
                className="block w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold transition-all text-center"
              >
                🔐 Aller à la connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
