// Active le rendu côté client (nécessaire pour les hooks useState et fetch)
"use client"
import React, { useState } from 'react'
// Fonction pour améliorer les idées avec OpenAI
import { improveWithOpenAIClient } from '../lib/ai/openaiClient'
// Dictionnaire des traductions (FR/EN)
import { translations } from '../lib/translations'

// Type pour une idée de projet (titre + description)
type Idea = {
  title: string
  description: string
}

// Type des props que le composant reçoit du parent
type IdeaGeneratorProps = {
  language: 'fr' | 'en' // Langue actuelle
  openaiKey: string | null // Clé OpenAI optionnelle
  openaiModel: string // Modèle OpenAI sélectionné
  onSelectIdea: (idea: string) => void // Callback quand l'utilisateur sélectionne une idée
}

export default function IdeaGenerator({ language, openaiKey, openaiModel, onSelectIdea }: IdeaGeneratorProps) {
  // ===== STATES LOCAUX =====
  // Détecte si le composant est monté côté client (évite les erreurs hydration)
  const [isClient, setIsClient] = React.useState(false)
  // Contrôle l'affichage/masquage du panneau d'idées
  const [isOpen, setIsOpen] = useState(false)
  // Array des idées générées par IA
  const [ideas, setIdeas] = useState<Idea[]>([])
  // Indicateur de chargement pendant la génération
  const [isLoading, setIsLoading] = useState(false)
  // Objet de traductions pour la langue actuelle
  const t = translations[language]

  // Shortcut pour vérifier si la langue est FR
  const isFr = language === 'fr'

  // ===== EFFECT: DÉTECTER LE MONTAGE CLIENT =====
  // Runs une seule fois - définit isClient=true pour éviter les mismatches hydration
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // ===== FONCTION: GÉNÉRER DES IDÉES AVEC IA =====
  async function generateIdeas() {
    // Vérifie si l'utilisateur a fourni une clé OpenAI
    if (!openaiKey) {
      alert(isFr ? 'Clé OpenAI manquante' : 'OpenAI key missing')
      return
    }

    // Active le spinner de chargement
    setIsLoading(true)
    try {
      // Prompt traduit pour demander 5 idées de projets innovants
      const prompt = isFr
        ? `Génère 5 idées de projets web/app innovants et intéressants. Format JSON strict:
[
  { "title": "Nom du projet", "description": "Description courte (1-2 lignes)" },
  ...
]`
        : `Generate 5 innovative and interesting web/app project ideas. Strict JSON format:
[
  { "title": "Project Name", "description": "Short description (1-2 lines)" },
  ...
]`

      // Appel à l'API pour générer les idées
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, openaiKey, openaiModel })
      })

      const data = await response.json()
      // Vérifie que la réponse contient un array valide
      if (data.ideas && Array.isArray(data.ideas)) {
        setIdeas(data.ideas) // Stocke les idées générées
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
      alert(isFr ? 'Erreur lors de la génération' : 'Error generating ideas')
    } finally {
      // Désactive le spinner même en cas d'erreur
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-4">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true)
            generateIdeas()
          }}
          suppressHydrationWarning
          className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/50"
        >
          💡 {isFr ? 'Inspirer-moi' : 'Give me ideas'}
        </button>
      ) : (
        <div className="bg-black/40 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 suppressHydrationWarning className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {isFr ? 'Idées de projets' : 'Project Ideas'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 text-xl"
            >
              ✕
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" />
              <p suppressHydrationWarning className="mt-2 text-slate-400 text-sm">
                {isFr ? 'Génération en cours...' : 'Generating...'}
              </p>
            </div>
          ) : ideas.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ideas.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectIdea(idea.title)
                    setIsOpen(false)
                  }}
                  className="w-full text-left p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors"
                >
                  <div className="font-semibold text-amber-300 text-sm">{idea.title}</div>
                  <div className="text-slate-300 text-xs mt-1">{idea.description}</div>
                </button>
              ))}
            </div>
          ) : (
            <p suppressHydrationWarning className="text-slate-400 text-sm">{isFr ? 'Aucune idée générée' : 'No ideas generated'}</p>
          )}

          <button
            onClick={generateIdeas}
            disabled={isLoading}
            suppressHydrationWarning
            className="mt-3 w-full px-3 py-2 bg-amber-600/50 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            {isFr ? '🔄 Régénérer' : '🔄 Regenerate'}
          </button>
        </div>
      )}
    </div>
  )
}
