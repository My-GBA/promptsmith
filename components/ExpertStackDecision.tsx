// Active le rendu côté client (nécessaire pour les hooks et animations)
"use client"
import React, { useEffect, useState } from 'react'
// Dictionnaire des traductions (FR/EN)
import { translations } from '../lib/translations'
// Store global pour accéder à la langue
import useStore from '../lib/store'

// Type des props que le composant reçoit du parent
interface ExpertStackDecisionProps {
  appType: string // Type d'application (web, mobile, API, etc)
  onAccept: (stack: string) => void // Callback quand l'utilisateur accepte
  onClose: () => void // Callback quand l'utilisateur ferme la modal
}

// ===== FONCTION: DÉCIDER LE MEILLEUR STACK PAR TYPE D'APP =====
// Cette fonction utilise la logique métier d'expert pour recommander le stack optimal
function getExpertRecommendation(appType: string): { stack: string; reason: string; icon: string } {
  const appTypeLower = appType.toLowerCase()

  // ===== CAS WEB =====
  // Pour les applications web modernes, recommande le full-stack Next.js
  if (appTypeLower.includes('web')) {
    return {
      stack: 'Next.js 15 + TypeScript + Tailwind CSS + Prisma + PostgreSQL',
      reason: 'Next.js est le standard de l\'industrie pour les applications web modernes. TypeScript assure la sécurité des types. Tailwind pour le design. Prisma pour la base de données. PostgreSQL pour la fiabilité.',
      icon: '🌐'
    }
  }

  // ===== CAS MOBILE =====
  // Pour les apps mobiles cross-platform (iOS + Android)
  if (appTypeLower.includes('mobile') || appTypeLower.includes('app')) {
    return {
      stack: 'React Native + Expo + TypeScript + Firebase',
      reason: 'React Native permet le partage de code entre iOS et Android. Expo simplifie le développement. TypeScript pour la sécurité. Firebase pour le backend.',
      icon: '📱'
    }
  }

  // ===== CAS API/BACKEND =====
  // Pour les serveurs et APIs scalables
  if (appTypeLower.includes('api') || appTypeLower.includes('backend') || appTypeLower.includes('serveur')) {
    return {
      stack: 'Node.js + Express + TypeScript + PostgreSQL + Redis',
      reason: 'Node.js est parfait pour les APIs scalables. Express est léger et flexible. TypeScript pour la sécurité des types. PostgreSQL pour les données. Redis pour le cache.',
      icon: '⚙️'
    }
  }

  // ===== CAS IA/ML =====
  // Pour les projets avec machine learning et intelligence artificielle
  if (appTypeLower.includes('ai') || appTypeLower.includes('ml') || appTypeLower.includes('machine')) {
    return {
      stack: 'Python + FastAPI + PyTorch/TensorFlow + PostgreSQL',
      reason: 'Python domine l\'IA/ML. FastAPI est moderne et rapide. PyTorch/TensorFlow pour les modèles ML. PostgreSQL pour le stockage des données.',
      icon: '🤖'
    }
  }

  // ===== CAS DATA/ANALYTICS =====
  // Pour les dashboards et outils d'analyse de données
  if (appTypeLower.includes('data') || appTypeLower.includes('analytics') || appTypeLower.includes('dashboard')) {
    return {
      stack: 'Next.js + TanStack Query + Recharts + DuckDB',
      reason: 'Next.js pour le frontend. TanStack Query pour la récupération des données. Recharts pour la visualisation. DuckDB pour l\'analyse rapide.',
      icon: '📊'
    }
  }

  // ===== CAS SAAS =====
  // Pour les services avec abonnements et paiements
  if (appTypeLower.includes('saas') || appTypeLower.includes('subscription') || appTypeLower.includes('service')) {
    return {
      stack: 'Next.js + Supabase + Stripe + Vercel',
      reason: 'Next.js pour le full stack. Supabase pour la base de données et l\'authentification. Stripe pour les paiements. Vercel pour le déploiement.',
      icon: '💼'
    }
  }

  // ===== CAS E-COMMERCE =====
  // Pour les boutiques en ligne
  if (appTypeLower.includes('ecommerce') || appTypeLower.includes('shop') || appTypeLower.includes('store')) {
    return {
      stack: 'Next.js + Shopify API + Stripe + PostgreSQL',
      reason: 'Next.js pour les performances. API Shopify pour la gestion des produits. Stripe pour les paiements sécurisés. PostgreSQL pour les données personnalisées.',
      icon: '🛒'
    }
  }

  // ===== CAS PAR DÉFAUT =====
  // Si le type d'app ne correspond à aucun cas spécifique
  return {
    stack: 'Next.js 15 + TypeScript + Tailwind CSS + Supabase',
    reason: 'Solution full-stack universelle. Next.js gère le frontend et le backend. TypeScript pour la sécurité. Tailwind pour le design. Supabase pour la base de données.',
    icon: '⭐'
  }
}

export default function ExpertStackDecision({ appType, onAccept, onClose }: ExpertStackDecisionProps) {
  // ===== STATES ET HOOKS =====
  // Langue actuelle de l'utilisateur (FR/EN)
  const language = useStore(s => s.language)
  // Objet de traductions pour la langue actuelle
  const t = translations[language]
  // Contrôle l'animation d'apparition de la modal (fade-in)
  const [isAnimating, setIsAnimating] = useState(false)

  // ===== EFFECT: DÉCLENCHER L'ANIMATION =====
  // Runs une seule fois - lance l'animation d'apparition au mount de la modal
  useEffect(() => {
    setIsAnimating(true)
  }, [])

  // Obtient la recommandation de stack basée sur le type d'app
  const recommendation = getExpertRecommendation(appType)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 overflow-y-auto">
      <div
        className={`w-full max-w-xl bg-gradient-to-br from-slate-950 via-black to-slate-900 border-2 border-pink-500/60 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-2xl shadow-pink-500/40 transform transition-all duration-500 my-2 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-1 sm:top-2 right-1 sm:right-2 text-lg sm:text-xl text-slate-400 hover:text-pink-400 transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-2 sm:mb-3 text-center pt-1">
          <div className="text-3xl sm:text-4xl mb-1 animate-pulse">{recommendation.icon}</div>
          <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 bg-clip-text text-transparent mb-0.5">
            Ma Décision d'Expert
          </h2>
          <p className="text-xs text-slate-400 px-1">
            LE meilleur stack pour votre projet.
          </p>
        </div>

        {/* Recommendation Box */}
        <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/40 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
          <div className="mb-2">
            <p className="text-slate-400 text-xs mb-0.5 font-semibold uppercase tracking-wider">
              APP:
            </p>
            <h3 className="text-sm sm:text-base font-bold text-white break-words">{appType}</h3>
          </div>

          <div className="border-t border-pink-500/20 pt-2">
            <p className="text-slate-300 text-xs mb-1 font-semibold uppercase tracking-wider">
              STACK:
            </p>
            <div className="bg-black/40 border border-pink-500/50 rounded p-1.5 sm:p-2 mb-2 overflow-x-auto">
              <code className="text-xs font-bold text-transparent bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text block whitespace-pre-wrap break-words leading-tight">
                {recommendation.stack}
              </code>
            </div>

            <p className="text-slate-400 text-xs mb-1 font-semibold uppercase tracking-wider">
              POURQUOI:
            </p>
            <p className="text-slate-200 leading-tight text-xs">
              {recommendation.reason}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 sm:gap-2 flex-col sm:flex-row">
          <button
            onClick={() => onAccept(recommendation.stack)}
            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded font-bold text-xs sm:text-sm transition-all duration-200 hover:shadow-xl hover:shadow-pink-500/50"
          >
            ✅ Accepter
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-all duration-200 text-xs sm:text-sm"
          >
            ✕ Refuser
          </button>
        </div>
      </div>
    </div>
  )
}
