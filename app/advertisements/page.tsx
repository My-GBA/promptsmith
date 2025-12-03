// Page de gestion des publicités - Espace privé pour l'administrateur
"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useStore from '../../lib/store'
import { Advertisement } from '../../lib/types/advertisement'
import { translations } from '../../lib/translations'

export default function AdvertisementsPage() {
  const router = useRouter()
  
  // ===== STATES =====
  // Empêche le hydration mismatch en rendant côté client seulement au départ
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Langue actuelle
  const language = useStore(s => s.language)
  const t = translations[language]
  
  // Tous les advertisements du store
  const advertisements = useStore(s => s.advertisements)
  const addAdvertisement = useStore(s => s.addAdvertisement)
  const updateAdvertisement = useStore(s => s.updateAdvertisement)
  const deleteAdvertisement = useStore(s => s.deleteAdvertisement)
  
  // ===== FORM STATES =====
  // État du formulaire pour ajouter/éditer une annonce
  const [formData, setFormData] = useState<Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    mediaType: 'image',
    mediaUrl: '',
    targetLink: '',
    buttonText: 'En savoir plus',
    isActive: true
  })
  
  // ID de l'annonce en cours d'édition (null = créer une nouvelle)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // ===== EFFECT: CLIENT ONLY =====
  // Évite le hydration mismatch en attendant que le composant soit monté côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // ===== EFFECT: VÉRIFICATION AUTHENTIFICATION =====
  // Vérifie si l'utilisateur est authentifié, sinon redirige vers login
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem('admin_authenticated')
      if (isAuth === 'true') {
        setIsAuthenticated(true)
        // Après auth, charger les pubs depuis le serveur
        refreshAds().finally(() => setIsLoading(false))
      } else {
        router.replace('/admin-login')
      }
    }
    checkAuth()
  }, [router])

  // Charge les publicités depuis l'API et synchronise le store
  const refreshAds = async () => {
    try {
      const res = await fetch('/api/ads', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      const mapped = (data.ads || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        mediaType: a.media_type,
        mediaUrl: a.media_url,
        targetLink: a.target_link,
        buttonText: a.button_text,
        isActive: a.is_active,
        createdAt: new Date(a.created_at).getTime(),
        updatedAt: new Date(a.updated_at).getTime(),
      }))
      useStore.getState().setAdvertisements(mapped)
    } catch {}
  }

  // Fonction de déconnexion
  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}
    sessionStorage.removeItem('admin_authenticated')
    router.push('/settings')
  }
  
  // ===== FONCTIONS =====
  // Ajoute ou met à jour une annonce (persistée côté serveur)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.targetLink || !formData.mediaUrl) {
      alert('Veuillez remplir tous les champs obligatoires (y compris le média)')
      return
    }
    
    if (editingId) {
      // Mise à jour
      try {
        const res = await fetch(`/api/ads/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
        if (!res.ok) {
          const errorText = await res.text()
          console.error('❌ Erreur UPDATE:', res.status, errorText)
          alert(`Erreur lors de la mise à jour: ${res.status} - ${errorText.substring(0, 100)}`)
          throw new Error('Update failed')
        }
        await refreshAds()
        alert('✅ Publicité mise à jour avec succès!')
      } catch (err) {
        console.error('❌ Exception UPDATE:', err)
        // En échec serveur, conserver au moins côté client
        updateAdvertisement(editingId, formData)
      }
      setEditingId(null)
    } else {
      // Créer une nouvelle
      try {
        console.log('📤 Envoi publicité, taille mediaUrl:', formData.mediaUrl.length, 'caractères')
        const res = await fetch('/api/ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
        if (!res.ok) {
          const errorText = await res.text()
          console.error('❌ Erreur CREATE:', res.status, errorText)
          alert(`Erreur lors de la création: ${res.status} - ${errorText.substring(0, 200)}`)
          throw new Error('Create failed')
        }
        const result = await res.json()
        console.log('✅ Publicité créée:', result)
        await refreshAds()
        alert('✅ Publicité ajoutée avec succès!')
      } catch (err) {
        console.error('❌ Exception CREATE:', err)
        alert('Erreur: ' + (err as Error).message)
        // Fallback client-only si serveur indisponible
        addAdvertisement(formData)
      }
    }
    
    // Réinitialise le formulaire
    setFormData({
      title: '',
      description: '',
      mediaType: 'image',
      mediaUrl: '',
      targetLink: '',
      buttonText: 'En savoir plus',
      isActive: true
    })
  }
  
  // Lance l'édition d'une annonce existante
  const handleEdit = (ad: Advertisement) => {
    const { id, createdAt, updatedAt, ...editData } = ad
    setFormData(editData)
    setEditingId(id)
  }
  
  // Bascule l'état actif/inactif d'une annonce
  const handleToggleActive = async (id: string) => {
    const ad = advertisements.find(a => a.id === id)
    if (ad) {
      const updated = { ...ad, isActive: !ad.isActive }
      try {
        const res = await fetch(`/api/ads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: updated.isActive }) })
        if (!res.ok) throw new Error('Toggle failed')
        await refreshAds()
      } catch {
        updateAdvertisement(id, { isActive: updated.isActive })
      }
    }
  }

  // Annule l'édition
  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      mediaType: 'image',
      mediaUrl: '',
      targetLink: '',
      buttonText: 'En savoir plus',
      isActive: true
    })
  }

  // Afficher un loader pendant la vérification
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-pink-400 hover:text-pink-300">
            ← Retour
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-all text-sm"
          >
            🚪 Déconnexion
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-2">🛡️ Gestion des Publicités</h1>
        <p className="text-slate-400">Gérez vos annonces publicitaires qui s'affichent après la génération des prompts</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* === FORMULAIRE === */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Modifier' : 'Ajouter'} une Publicité
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Mon Super Produit"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la publicité"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                />
              </div>

              {/* Type de Média */}
              <div>
                <label className="block text-sm font-semibold mb-2">Type de Média *</label>
                <select
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'image' | 'video' })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                >
                  <option value="image">🖼️ Image</option>
                  <option value="video">🎬 Vidéo</option>
                </select>
              </div>

              {/* Upload Média */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {formData.mediaType === 'image' ? '📤 Upload Image' : '📤 Upload Vidéo'} *
                </label>
                <input
                  type="file"
                  accept={formData.mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Vérifier la taille (max 5MB pour images, 10MB pour vidéos)
                      const maxSize = formData.mediaType === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
                      if (file.size > maxSize) {
                        alert(`Fichier trop volumineux! Max ${formData.mediaType === 'image' ? '5' : '10'}MB`)
                        e.target.value = ''
                        return
                      }
                      
                      // Convertir en base64
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setFormData({ ...formData, mediaUrl: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-500 file:cursor-pointer focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {formData.mediaType === 'image' 
                    ? '📐 Recommandé: 1200x600px • Max 5MB • JPG, PNG, GIF'
                    : '🎬 Max 10MB • MP4, WebM, Ogg'
                  }
                </p>
                {/* Preview */}
                {formData.mediaUrl && (
                  <div className="mt-2 relative">
                    {formData.mediaType === 'image' ? (
                      <img 
                        src={formData.mediaUrl} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-pink-500/30"
                      />
                    ) : (
                      <video 
                        src={formData.mediaUrl} 
                        className="w-full h-32 object-cover rounded-lg border border-pink-500/30"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mediaUrl: '' })}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Lien Cible */}
              <div>
                <label className="block text-sm font-semibold mb-2">Lien Cible (URL) *</label>
                <input
                  type="url"
                  value={formData.targetLink}
                  onChange={(e) => setFormData({ ...formData, targetLink: e.target.value })}
                  placeholder="https://monpartenaire.com"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                />
              </div>

              {/* Texte Bouton */}
              <div>
                <label className="block text-sm font-semibold mb-2">Texte du Bouton</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="Cliquez ici"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                />
              </div>

              {/* Actif/Inactif */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-semibold">Activée</label>
              </div>

              {/* Boutons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-lg transition-all"
                >
                  {editingId ? '💾 Mettre à jour' : '➕ Ajouter'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* === LISTE DES PUBLICITÉS === */}
        {isClient && (
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                Vos Publicités ({advertisements.length})
              </h2>

              {advertisements.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Aucune publicité pour le moment. Créez-en une ci-contre!</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {advertisements.map((ad) => (
                  <div
                    key={ad.id}
                    className={`p-4 border rounded-lg transition-all ${
                      ad.isActive
                        ? 'border-pink-500/40 bg-pink-500/5'
                        : 'border-slate-700 bg-slate-900/50'
                    }`}
                  >
                    {/* En-tête avec titre et statut */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{ad.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        ad.isActive
                          ? 'bg-green-500/30 text-green-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {ad.isActive ? '🟢 Actif' : '⚫ Inactif'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 mb-3">{ad.description}</p>

                    {/* Type de média */}
                    <p className="text-xs text-slate-400 mb-2">
                      📺 {ad.mediaType === 'image' ? '🖼️ Image' : '🎬 Vidéo'}
                    </p>

                    {/* Preview média */}
                    {ad.mediaUrl && (
                      <div className="mb-3 h-24 bg-slate-900 rounded overflow-hidden">
                        {ad.mediaType === 'image' ? (
                          <img
                            src={ad.mediaUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={ad.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        )}
                      </div>
                    )}

                    {/* Lien cible */}
                    <p className="text-xs text-slate-500 mb-3 truncate">
                      🔗 {ad.targetLink}
                    </p>

                    {/* Boutons d'actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sm rounded transition-all"
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        onClick={() => handleToggleActive(ad.id)}
                        className={`flex-1 px-3 py-1 text-sm rounded transition-all ${
                          ad.isActive
                            ? 'bg-slate-700 hover:bg-slate-600'
                            : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                        }`}
                      >
                        {ad.isActive ? '🔴 Désactiver' : '🟢 Activer'}
                      </button>
                      <button
                        onClick={async () => { 
                          try { 
                            const res = await fetch(`/api/ads/${ad.id}`, { method: 'DELETE' }) 
                            if (!res.ok) throw new Error('Delete failed')
                            await refreshAds()
                          } catch { 
                            deleteAdvertisement(ad.id) 
                          } 
                        }}
                        className="flex-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded transition-all"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>

                    {/* Meta info */}
                    <p className="text-xs text-slate-600 mt-2">
                      Créé: {new Date(ad.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
        <p className="font-semibold mb-2">ℹ️ Comment ça marche?</p>
        <ul className="space-y-1 text-slate-300">
          <li>✓ Chaque fois qu'un utilisateur génère un prompt, une publicité s'affiche</li>
          <li>✓ Si vous avez plusieurs publicités activées, elles s'affichent en rotation</li>
          <li>✓ L'utilisateur peut cliquer pour aller sur votre lien partenaire</li>
          <li>✓ Vous pouvez activer/désactiver les publicités sans les supprimer</li>
        </ul>
      </div>
    </div>
  )
}
