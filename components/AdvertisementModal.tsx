// Active le rendu côté client (nécessaire pour les interactions)
"use client"
import React, { useState, useEffect } from 'react'
// Type pour une annonce publicitaire
import { Advertisement } from '../lib/types/advertisement'

// Type des props que le composant reçoit
interface AdvertisementModalProps {
  // L'annonce à afficher
  ad: Advertisement | null
  // Callback quand l'utilisateur ferme la modal (sans cliquer)
  onClose: () => void
}

export default function AdvertisementModal({ ad, onClose }: AdvertisementModalProps) {
  // ===== STATE =====
  // Contrôle l'animation d'apparition
  const [isAnimating, setIsAnimating] = useState(false)

  // ===== EFFECT: ANIMATION À L'APPARITION =====
  // Lance l'animation au mount
  useEffect(() => {
    setIsAnimating(true)
  }, [ad])

  // ===== EFFECT: GESTION DU CLIC EXTÉRIEUR =====
  // Ferme la modal si l'utilisateur clique en dehors
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // ===== RENDU =====
  // Affiche rien si pas d'annonce
  if (!ad) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose} // Ferme en cliquant sur le fond
    >
      {/* Modal principale */}
      <div
        className={`max-w-4xl w-full bg-white rounded-2xl shadow-2xl transform transition-all duration-500 overflow-hidden relative ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()} // Empêche de fermer en cliquant sur la modal
      >
        {/* Bouton de fermeture en haut à droite */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 text-gray-600 hover:text-gray-900 transition-colors shadow-lg"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenu de l'annonce */}
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Média: Image ou Vidéo */}
          {ad.mediaUrl && (
            <div className="w-full md:w-1/2 flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden max-h-[50vh] md:max-h-[90vh]">
              {ad.mediaType === 'image' ? (
                // Affichage de l'image
                <img
                  src={ad.mediaUrl}
                  alt={ad.title}
                  className="w-full h-full object-contain md:object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                // Affichage de la vidéo avec autoplay et controls
                <video
                  src={ad.mediaUrl}
                  className="w-full h-full object-contain md:object-cover"
                  autoPlay
                  loop
                  muted
                  controls
                />
              )}
            </div>
          )}

          {/* Contenu texte et bouton */}
          <div className={`p-6 md:p-8 flex flex-col justify-between overflow-y-auto ${ad.mediaUrl ? 'w-full md:w-1/2' : 'w-full'}`}>
            {/* Titre */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 pr-8">
                {ad.title}
              </h2>
              {/* Description */}
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {ad.description}
              </p>
            </div>

            {/* Bouton CTA */}
            <a
              href={ad.targetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-lg text-center inline-block text-sm sm:text-base"
            >
              {ad.buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
