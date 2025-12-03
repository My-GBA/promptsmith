// Composant serveur qui ne nécessite pas "use client"
import React from 'react'
import Link from 'next/link'
// Store global pour accéder à la langue et les setters
import useStore from '../lib/store'
// Dictionnaire des traductions (FR/EN)
import { translations } from '../lib/translations'

export default function Header() {
  // ===== STATES DU STORE =====
  // Langue actuelle de l'utilisateur (FR/EN)
  const language = useStore(s => s.language)
  // Fonction pour changer la langue
  const setLanguage = useStore(s => s.setLanguage)
  // Objet de traductions pour la langue actuelle
  const t = translations[language]

  return (
    // En-tête avec gradient et blur backdrop - responsive avec breakpoints md:
    <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-black/50 via-pink-900/10 to-black/50 border-b border-pink-500/20 backdrop-blur-xl gap-4 flex-wrap md:flex-nowrap">
      {/* Partie gauche: Logo et sous-titre */}
      <div className="flex-1 min-w-0">
        {/* Titre du site */}
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent truncate">
          PromptSmith
        </h1>
        {/* Sous-titre (caché sur mobile) */}
        <p className="text-xs md:text-sm text-slate-400 mt-0.5 md:mt-1 hidden sm:block">✨ Générateur de prompts pour IA de code</p>
      </div>

      {/* Partie droite: Sélecteur de langue, settings et version */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Sélecteur de langue avec drapeaux */}
        <select
          value={language}
          onChange={(e) => {
            // Type casting en 'fr' | 'en' pour TypeScript
            const newLang = e.target.value as 'fr' | 'en'
            setLanguage(newLang)
          }}
          className="px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs md:text-sm cursor-pointer hover:border-pink-500 transition-colors"
        >
          <option value="fr">🇫🇷 FR</option>
          <option value="en">🇬🇧 EN</option>
        </select>

        {/* Lien vers la page settings */}
        <Link 
          href="/settings" 
          className="px-2 md:px-4 py-2 text-slate-300 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-200 font-medium text-xs md:text-sm"
        >
          ⚙️ <span className="hidden md:inline">Settings</span>
        </Link>

        {/* Numéro de version (caché sur mobile) */}
        <div className="text-xs md:text-sm text-slate-500 hidden sm:block">v0.1</div>
      </div>
    </header>
  )
}
