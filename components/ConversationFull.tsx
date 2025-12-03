// Active le rendu côté client (nécessaire pour les hooks React et localStorage)
"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import useStore from '../lib/store' // Zustand store pour gérer l'état global
import { improveWithOpenAIClient } from '../lib/ai/openaiClient' // Fonction pour améliorer les prompts avec OpenAI
import { translations } from '../lib/translations' // Traductions FR/EN
import IdeaGenerator from './IdeaGenerator' // Composant générateur d'idées
import StackRecommendation from './StackRecommendation' // Modal de recommandation de stack
import ExpertStackDecision from './ExpertStackDecision' // Modal de décision expert
import AdvertisementModal from './AdvertisementModal' // Modal de publicité
import { Advertisement } from '../lib/types/advertisement' // Type pour les annonces

// Type pour les messages du chat (bot ou user)
type Message = { from: 'bot' | 'user'; text: string }

export default function ConversationFull() {
  // ===== STATES LOCAUX =====
  // Détecte si le composant est monté côté client (évite les erreurs hydration)
  const [isClient, setIsClient] = React.useState(false)
  // Suivi si le message initial a été défini
  const [initialMessageSet, setInitialMessageSet] = React.useState(false)
  // Array de tous les messages du conversation (bot + user)
  const [messages, setMessages] = useState<Message[]>([])
  // Texte saisi dans l'input utilisateur
  const [input, setInput] = useState('')
  // Étape actuelle du workflow (0-5 pour chaque question)
  const [step, setStep] = useState(0)
  // Indicateur de chargement pendant la génération
  const [isLoading, setIsLoading] = useState(false)
  // Affichage/masquage de la modal recommandation de stack
  const [showStackRecommendation, setShowStackRecommendation] = useState(false)
  // État pour l'annonce actuellement affichée (null si pas d'annonce)
  const [currentAdvertisement, setCurrentAdvertisement] = useState<Advertisement | null>(null)
  
  // ===== STATES DU ZUSTAND STORE =====
  // Setter pour le template de prompt
  const setTemplate = useStore(s => s.setTemplate)
  // Setter pour l'ambiance/vibe du projet
  const setVibe = useStore(s => s.setVibe)
  // Setter générique pour les champs du formulaire
  const setField = useStore(s => s.setField)
  // Setter pour stocker le prompt généré
  const setPrompt = useStore(s => s.setPrompt)
  // Langue actuelle (fr/en) chargée depuis localStorage
  const language = useStore(s => s.language)
  // Objet de traductions pour la langue actuelle
  const t = translations[language]
  // Clé OpenAI de l'utilisateur (pour l'amélioration IA du prompt)
  const openaiKey = useStore(s => s.openaiKey)
  // Modèle OpenAI sélectionné par l'utilisateur
  const openaiModel = useStore(s => s.openaiModel)
  // Prompt généré et stocké
  const prompt = useStore(s => s.prompt)
  // Fonction pour ajouter un prompt à l'historique
  const addToHistory = useStore(s => s.addToHistory)
  // Array des prompts en favoris
  const favorites = useStore(s => s.favorites)
  // Fonction pour toggle un prompt en favoris
  const toggleFavorite = useStore(s => s.toggleFavorite)
  // Tous les champs du formulaire (idée, appType, stack, complexité, etc)
  const fields = useStore(s => s.fields)
  // Fonction pour obtenir l'annonce suivante et mettre à jour l'index
  const nextAdvertisement = useStore(s => s.nextAdvertisement)

  // Charger les publicités globales depuis le serveur au montage
  React.useEffect(() => {
    (async () => {
      try {
        console.log('🔍 Chargement des publicités depuis /api/ads...')
        const res = await fetch('/api/ads', { cache: 'no-store' })
        const data = await res.json()
        console.log('📦 Données reçues de /api/ads:', data)
        if (data?.ads) {
          const mapped = data.ads.map((a: any) => ({
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
          console.log('✅ Publicités mappées:', mapped)
          useStore.getState().setAdvertisements(mapped)
        } else {
          console.log('⚠️ Aucune publicité dans la réponse')
        }
      } catch (err) {
        console.error('❌ Erreur lors du chargement des publicités:', err)
      }
    })()
  }, [])

  // ===== SUGGESTIONS MULTILINGUES =====
  // Object contenant les options pour chaque étape du workflow (traduits selon la langue)
  const suggestions = {
    // Types d'application possibles
    appType: language === 'fr' ? ['web', 'mobile', 'API'] : ['web', 'mobile', 'API'],
    // Stacks technologiques suggérés
    stack: language === 'fr' ? ['React', 'Next.js', 'Node.js', 'Python', 'Django'] : ['React', 'Next.js', 'Node.js', 'Python', 'Django'],
    // Niveaux de complexité du projet
    complexity: language === 'fr' ? ['simple', 'moyen', 'complexe'] : ['simple', 'medium', 'complex'],
    // Contraintes potentielles du projet
    constraints: language === 'fr' ? ['offline', 'budget limité', 'haute performance', 'sécurité élevée'] : ['offline', 'limited budget', 'high performance', 'high security'],
    // Options de confirmation (oui/non)
    confirm: language === 'fr' ? ['oui', 'non'] : ['yes', 'no']
  }

  // ===== EFFECT #1: DÉTECTER LE MONTAGE CLIENT =====
  // Runs une seule fois au mount - définit isClient=true pour éviter les mismatches hydration
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // ===== EFFECT #2: INITIALISER LE MESSAGE DE BIENVENUE =====
  // Runs quand isClient change - ajoute le premier message du bot en FR ou EN
  React.useEffect(() => {
    if (!isClient) return // Attend que le client soit ready
    if (initialMessageSet) return // Exécute qu'une seule fois
    
    // Message initial traduit selon la langue
    const initialMsg = language === 'fr'
      ? `Salut ! Quelle est votre idée de projet ? Décrivez brièvement ce que vous voulez créer.`
      : `Hi! What is your project idea? Briefly describe what you want to build.`
    // Ajoute le message initial et marque comme défini
    setMessages([{ from: 'bot', text: initialMsg }])
    setInitialMessageSet(true)
  }, [isClient])

  // ===== EFFECT #3: TRADUIRE LE MESSAGE AU CHANGEMENT DE LANGUE =====
  // Runs quand la langue change - traduit le message initial si pas de conversation
  React.useEffect(() => {
    if (!isClient || !initialMessageSet) return // Attend les prérequis
    
    // Message initial dans la nouvelle langue
    const initialMsg = language === 'fr'
      ? `Salut ! Quelle est votre idée de projet ? Décrivez brièvement ce que vous voulez créer.`
      : `Hi! What is your project idea? Briefly describe what you want to build.`
    
    // Met à jour le message initial SEULEMENT s'il y a qu'un message (pas de conversation en cours)
    if (messages.length === 1 && messages[0].from === 'bot') {
      setMessages([{ from: 'bot', text: initialMsg }])
    }
  }, [isClient, initialMessageSet, language])

  // ===== FONCTIONS HELPER =====
  // Ajoute un message du bot à la conversation
  function pushBot(text: string) {
    setMessages(m => [...m, { from: 'bot', text }])
  }

  // Ajoute un message de l'utilisateur à la conversation
  function pushUser(text: string) {
    setMessages(m => [...m, { from: 'user', text }])
  }

  async function processStep(rawValue: string) {
    const value = rawValue.trim()
    if (!value) return

    if (step === 0) {
      // First step: capture the user's project idea
      setTemplate('app-builder')
      setField('idea', value)
      pushBot(language === 'fr' ? `Super — idée reçue. Quel type d'application voulez-vous créer ? (ex: web, mobile, API)` : `Great — idea noted. What type of application would you like to build? (e.g. web, mobile, API)`)
      setStep(1)
      return
    }

    if (step === 1) {
      setField('appType', value)
      pushBot(language === 'fr' ? `Super — type: ${value}. Quel stack technologique souhaitez-vous ? Ex: React, Node.js, Python...` : `Great — type: ${value}. Which technology stack would you like? e.g. React, Node.js, Python...`)
      setStep(2)
      return
    }

    if (step === 2) {
      setField('stack', value)
      pushBot(language === 'fr' ? `Noté: ${value}. Quelle complexité (simple, moyen, complexe) ?` : `Noted: ${value}. What complexity (simple, medium, complex)?`)
      setStep(3)
      return
    }

    if (step === 3) {
      setField('complexity', value)
      pushBot(language === 'fr' ? `Bien. Y a-t-il des contraintes particulières ? (ex: offline, budget limité)` : `Good. Any constraints? (e.g. offline, limited budget)`)
      setStep(4)
      return
    }

    if (step === 4) {
      setField('constraints', value)
      pushBot(language === 'fr' ? 'Résumé reçu. Voulez-vous que je génère le prompt maintenant ? (oui / non)' : 'Summary received. Do you want me to generate the prompt now? (yes / no)')
      setStep(5)
      return
    }

    if (step === 5) {
      const positive = language === 'fr' ? ['oui', 'o', 'y'] : ['yes', 'y']
      if (positive.includes(value.toLowerCase())) {
        pushBot(language === 'fr' ? 'Génération en cours...' : 'Generating...')
        setIsLoading(true)
        
        const currentFields = useStore.getState().fields
        const res = await fetch('/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe: useStore.getState().vibe, template: useStore.getState().template, fields: currentFields, mode: 'local', language })
        })
        const data = await res.json()
        setIsLoading(false)
        
        if (data.prompt) {
          const basePrompt = data.prompt
          let finalPrompt = basePrompt
          if (openaiKey) {
            const improved = await improveWithOpenAIClient(basePrompt, openaiKey, openaiModel)
            finalPrompt = improved
            setPrompt(improved)
            pushBot(language === 'fr' ? 'Prompt IA généré — voir le panneau à droite.' : 'AI prompt generated — see the right panel.')
          } else {
            setPrompt(basePrompt)
            pushBot(language === 'fr' ? 'Prompt généré localement (clé IA manquante).' : 'Prompt generated locally (IA key missing).')
          }
          
          // AFFICHE L'ANNONCE PUBLICITAIRE SI ELLE EXISTE
          const ad = nextAdvertisement()
          console.log('🎯 Tentative d\'affichage de publicité:', ad)
          if (ad) {
            console.log('✅ Publicité à afficher:', ad)
            setCurrentAdvertisement(ad)
          } else {
            console.log('⚠️ Aucune publicité disponible (nextAdvertisement retourne null)')
          }
          
          // Add to history
          addToHistory({
            timestamp: Date.now(),
            idea: currentFields.idea || '',
            appType: currentFields.appType || '',
            stack: currentFields.stack || '',
            complexity: currentFields.complexity || '',
            constraints: currentFields.constraints || '',
            prompt: finalPrompt,
            isFavorite: false
          })
        } else {
          pushBot(language === 'fr' ? 'Erreur lors de la génération.' : 'Error generating prompt.')
        }
      } else {
        pushBot(language === 'fr' ? `D'accord — Vous pouvez relancer l'assistant pour une nouvelle génération.` : 'Okay — You can restart the assistant for a new generation.')
      }
      setStep(0)
      return
    }
  }

  async function handleSend() {
    if (!input.trim()) return
    pushUser(input)
    await processStep(input)
    setInput('')
  }

  function copyPrompt() {
    if (prompt) {
      navigator.clipboard.writeText(prompt)
      alert(language === 'fr' ? 'Prompt copié !' : 'Prompt copied!')
    }
  }

  function exportMarkdown() {
    if (prompt) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(prompt))
      element.setAttribute('download', 'prompt.md')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  function handleSelectIdea(idea: string) {
    pushUser(idea)
    setField('idea', idea)
    pushBot(language === 'fr' ? `Super — idée reçue. Quel type d'application voulez-vous créer ? (ex: web, mobile, API)` : `Great — idea noted. What type of application would you like to build? (e.g. web, mobile, API)`)
    setStep(1)
  }

  function handleStackRecommendation(stack: string) {
    setShowStackRecommendation(false)
    pushUser(stack)
    setField('stack', stack)
    pushBot(language === 'fr' ? `Noté: ${stack}. Quelle complexité (simple, moyen, complexe) ?` : `Noted: ${stack}. What complexity (simple, medium, complex)?`)
    setStep(3)
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen gap-3 md:gap-6 p-3 md:p-6 bg-gradient-to-br from-slate-950 via-black to-slate-900">
      {/* Left: Conversation */}
      <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4 md:p-6 shadow-2xl min-h-[50vh] lg:min-h-auto">
        <div className="mb-4">
          <h2 suppressHydrationWarning className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            {language === 'fr' ? 'Assistant Guidé' : 'Guided Assistant'}
          </h2>
          <div className="h-0.5 bg-gradient-to-r from-pink-500 to-transparent mt-2" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {isClient && messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-3 rounded-lg text-sm md:text-base ${
                  m.from === 'bot'
                    ? 'bg-pink-500/10 border border-pink-500/30 text-slate-200'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-pink-500/10 border border-pink-500/30 text-slate-300 rounded-lg animate-pulse text-sm md:text-base" suppressHydrationWarning>
                {language === 'fr' ? 'Génération en cours...' : 'Generating...'}
              </div>
            </div>
          )}
        </div>

        {/* Suggestion buttons + Idea Generator */}
        {step === 0 && (
          <IdeaGenerator
            language={language}
            openaiKey={openaiKey}
            openaiModel={openaiModel}
            onSelectIdea={handleSelectIdea}
          />
        )}

        {step < 6 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {step === 1 && suggestions.appType.map((s) => (
              <button
                key={s}
                onClick={async () => { pushUser(s); await processStep(s) }}
                className="px-2 md:px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
              >
                {s}
              </button>
            ))}
            {step === 2 && (
              <>
                {suggestions.stack.map((s) => (
                  <button
                    key={s}
                    onClick={async () => { pushUser(s); await processStep(s) }}
                    className="px-2 md:px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => setShowStackRecommendation(true)}
                  className="px-2 md:px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 border-2 border-purple-400/50"
                >
                  🤖 {language === 'fr' ? 'Me recommander' : "Don't know"}
                </button>
              </>
            )}
            {step === 3 && suggestions.complexity.map((s) => (
              <button
                key={s}
                onClick={async () => { pushUser(s); await processStep(s) }}
                className="px-2 md:px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
              >
                {s}
              </button>
            ))}
            {step === 4 && suggestions.constraints.map((s) => (
              <button
                key={s}
                onClick={async () => { pushUser(s); await processStep(s) }}
                className="px-2 md:px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
              >
                {s}
              </button>
            ))}
            {step === 5 && suggestions.confirm.map((s) => (
              <button
                key={s}
                onClick={async () => { pushUser(s); await processStep(s) }}
                className="px-2 md:px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'fr' ? 'Écrivez votre réponse...' : 'Type your answer...'}
            suppressHydrationWarning
            className="flex-1 px-4 py-3 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            suppressHydrationWarning
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-bold transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
          >
            {language === 'fr' ? 'Envoyer' : 'Send'}
          </button>
        </div>
      </div>

      {/* Stack Recommendation Modal */}
      {showStackRecommendation && (
        <ExpertStackDecision
          appType={fields.appType || 'web'}
          onAccept={handleStackRecommendation}
          onClose={() => setShowStackRecommendation(false)}
        />
      )}

      {/* Advertisement Modal - S'affiche après génération du prompt */}
      <AdvertisementModal
        ad={currentAdvertisement}
        onClose={() => setCurrentAdvertisement(null)}
      />

      {/* Right: Prompt Output */}
      <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 shadow-2xl">
        <div className="mb-4 flex justify-between items-start">
          <div className="flex-1">
            <h2 suppressHydrationWarning className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              {language === 'fr' ? 'Prompt Généré' : 'Generated Prompt'}
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-pink-500 to-transparent mt-2" />
          </div>
          <div className="flex gap-2 ml-4">
            <Link
              href="/history"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-all text-sm"
              suppressHydrationWarning
            >
              📜 {language === 'fr' ? 'Historique' : 'History'}
            </Link>
            {prompt && (
              <button
                onClick={() => {
                  if (prompt) {
                    toggleFavorite(prompt)
                  }
                }}
                suppressHydrationWarning
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-all text-sm"
              >
                {favorites.includes(prompt) ? '⭐ ' : '☆ '}{language === 'fr' ? 'Favoris' : 'Favorite'}
              </button>
            )}
          </div>
        </div>

        {/* Prompt display */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {prompt ? (
            <div className="bg-slate-900/50 border border-pink-500/20 rounded-lg p-4 text-slate-200 whitespace-pre-wrap text-sm font-mono">
              {prompt}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">✨</div>
                <p suppressHydrationWarning>{language === 'fr' ? 'Votre prompt apparaîtra ici' : 'Your prompt will appear here'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Export buttons */}
        {prompt && (
          <div className="flex gap-2">
            <button
              onClick={copyPrompt}
              suppressHydrationWarning
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
            >
              {language === 'fr' ? '📋 Copier' : '📋 Copy'}
            </button>
            <button
              onClick={exportMarkdown}
              suppressHydrationWarning
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
            >
              {language === 'fr' ? '📄 MD' : '📄 MD'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
