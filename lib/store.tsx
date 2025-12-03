"use client"
import { create } from 'zustand'
import { Language } from './translations'
import { Advertisement } from './types/advertisement'

// Type pour une entrée de l'historique des prompts générés
export type PromptHistory = {
  id: string
  timestamp: number
  idea: string
  appType: string
  stack: string
  complexity: string
  constraints: string
  prompt: string
  isFavorite: boolean
}

// Type pour l'état global du store
type State = {
  // ===== PROMPT & GENERATION =====
  vibe: string | null
  template: string | null
  fields: Record<string, string>
  prompt: string | null
  // ===== LANGUAGE & CONFIG =====
  language: Language
  openaiKey: string | null
  openaiModel: string
  // ===== HISTORY & FAVORITES =====
  history: PromptHistory[]
  favorites: string[]
  // ===== ADVERTISEMENTS =====
  advertisements: Advertisement[] // Array de toutes les annonces
  currentAdIndex: number // Index de l'annonce en cours (pour la rotation)
  // ===== SETTERS =====
  setVibe: (v: string) => void
  setTemplate: (t: string) => void
  setField: (k: string, v: string) => void
  setPrompt: (p: string) => void
  setLanguage: (lang: Language) => void
  setOpenAIKey: (k: string | null) => void
  setOpenAIModel: (m: string) => void
  addToHistory: (entry: Omit<PromptHistory, 'id'>) => void
  removeFromHistory: (id: string) => void
  toggleFavorite: (id: string) => void
  clearHistory: () => void
  // ===== ADVERTISEMENT SETTERS =====
  addAdvertisement: (ad: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAdvertisement: (id: string, updates: Partial<Advertisement>) => void
  deleteAdvertisement: (id: string) => void
  setAdvertisements: (ads: Advertisement[]) => void
  nextAdvertisement: () => Advertisement | null // Retourne l'annonce suivante et met à jour l'index
}

// Initialisation des valeurs depuis localStorage avec gestion d'erreur
const initialOpenAIKey = typeof window !== 'undefined' ? sessionStorage.getItem('OPENAI_API_KEY') : null
const initialLang = (typeof window !== 'undefined' ? localStorage.getItem('LANGUAGE') : 'fr') as Language
const initialOpenAIModel = (typeof window !== 'undefined' ? localStorage.getItem('OPENAI_MODEL') : 'gpt-4o') || 'gpt-4o'

// JSON.parse sécurisé avec try-catch
const safeJSONParse = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

const initialHistory: PromptHistory[] = safeJSONParse('PROMPT_HISTORY', [])
const initialFavorites: string[] = safeJSONParse('PROMPT_FAVORITES', [])
const initialAdvertisements: Advertisement[] = safeJSONParse('ADVERTISEMENTS', [])

// Création du store Zustand
const useStore = create<State>((set, get) => ({
  // ===== INITIAL STATES =====
  vibe: 'minimal',
  template: 'app-builder',
  fields: {},
  prompt: null,
  language: initialLang || 'fr',
  openaiKey: initialOpenAIKey,
  openaiModel: initialOpenAIModel,
  history: initialHistory,
  favorites: initialFavorites,
  advertisements: initialAdvertisements,
  currentAdIndex: 0,

  // ===== VIBE & TEMPLATE SETTERS =====
  setVibe: (v) => set({ vibe: v }),
  setTemplate: (t) => set({ template: t }),
  
  // ===== FIELD SETTER (pour les champs du formulaire) =====
  setField: (k, v) => set((s) => ({ fields: { ...s.fields, [k]: v } })),
  
  // ===== PROMPT SETTER =====
  setPrompt: (p) => set({ prompt: p }),
  
  // ===== LANGUAGE SETTER (avec persistence) =====
  setLanguage: (lang) => {
    try {
      localStorage.setItem('LANGUAGE', lang)
    } catch (e) {
      // ignore localStorage errors
    }
    set({ language: lang })
  },
  
  // ===== OPENAI KEY SETTER (avec persistence en sessionStorage pour sécurité) =====
  setOpenAIKey: (k) => {
    try {
      if (k) sessionStorage.setItem('OPENAI_API_KEY', k)
      else sessionStorage.removeItem('OPENAI_API_KEY')
    } catch (e) {}
    set({ openaiKey: k })
  },
  
  // ===== OPENAI MODEL SETTER (avec persistence) =====
  setOpenAIModel: (m) => {
    try {
      localStorage.setItem('OPENAI_MODEL', m)
    } catch (e) {}
    set({ openaiModel: m })
  },
  
  // ===== HISTORY FUNCTIONS =====
  addToHistory: (entry) => set((s) => {
    const MAX_HISTORY = 100
    const newHistory = [{ ...entry, id: Date.now().toString() }, ...s.history].slice(0, MAX_HISTORY)
    try {
      localStorage.setItem('PROMPT_HISTORY', JSON.stringify(newHistory))
    } catch (e) {}
    return { history: newHistory }
  }),
  removeFromHistory: (id) => set((s) => {
    const newHistory = s.history.filter(h => h.id !== id)
    try {
      localStorage.setItem('PROMPT_HISTORY', JSON.stringify(newHistory))
    } catch (e) {}
    return { history: newHistory }
  }),
  toggleFavorite: (id) => set((s) => {
    const newFavorites = s.favorites.includes(id)
      ? s.favorites.filter(fav => fav !== id)
      : [...s.favorites, id]
    try {
      localStorage.setItem('PROMPT_FAVORITES', JSON.stringify(newFavorites))
    } catch (e) {}
    return { favorites: newFavorites }
  }),
  clearHistory: () => {
    try {
      localStorage.removeItem('PROMPT_HISTORY')
    } catch (e) {}
    set({ history: [] })
  },

  // ===== ADVERTISEMENT FUNCTIONS =====
  // Ajoute une nouvelle annonce avec ID et timestamps auto-générés
  addAdvertisement: (ad) => set((s) => {
    const newAd: Advertisement = {
      ...ad,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const newAds = [newAd, ...s.advertisements]
    try {
      localStorage.setItem('ADVERTISEMENTS', JSON.stringify(newAds))
    } catch (e) {}
    return { advertisements: newAds }
  }),
  
  // Met à jour une annonce existante
  updateAdvertisement: (id, updates) => set((s) => {
    const newAds = s.advertisements.map(ad =>
      ad.id === id ? { ...ad, ...updates, updatedAt: Date.now() } : ad
    )
    try {
      localStorage.setItem('ADVERTISEMENTS', JSON.stringify(newAds))
    } catch (e) {}
    return { advertisements: newAds }
  }),
  
  // Supprime une annonce
  deleteAdvertisement: (id) => set((s) => {
    const newAds = s.advertisements.filter(ad => ad.id !== id)
    try {
      localStorage.setItem('ADVERTISEMENTS', JSON.stringify(newAds))
    } catch (e) {}
    return { advertisements: newAds }
  }),
  
  // Remplace toutes les annonces (utile pour import/export)
  setAdvertisements: (ads) => set((s) => {
    try {
      localStorage.setItem('ADVERTISEMENTS', JSON.stringify(ads))
    } catch (e) {}
    return { advertisements: ads }
  }),
  
  // Retourne l'annonce suivante et incrémente l'index (système de rotation)
  nextAdvertisement: () => {
    const state = get()
    const activeAds = state.advertisements.filter(ad => ad.isActive)

    if (activeAds.length === 0) {
      return null
    }

    // Trouve l'annonce active actuelle dans le tableau filtré
    const currentAd = state.advertisements[state.currentAdIndex]
    let currentActiveIdx = activeAds.findIndex(ad => ad.id === currentAd?.id)

    // Si l'annonce actuelle n'est pas active ou n'existe pas, commencer à 0
    if (currentActiveIdx === -1) {
      currentActiveIdx = 0
    }

    // Calcule l'index suivant avec modulo pour la rotation
    const nextActiveIdx = (currentActiveIdx + 1) % activeAds.length
    const nextAd = activeAds[nextActiveIdx]

    // Trouve l'index global de cette annonce
    const globalIdx = state.advertisements.findIndex(ad => ad.id === nextAd.id)
    set({ currentAdIndex: globalIdx })

    return nextAd
  }
}))

export default useStore
