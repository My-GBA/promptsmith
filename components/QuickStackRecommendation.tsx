"use client"
import React from 'react'
import { translations } from '../lib/translations'
import useStore from '../lib/store'

interface QuickStackRecommendationProps {
  onSelectStack: (stack: string) => void
  onClose: () => void
}

const STACK_RECOMMENDATIONS = {
  'web-frontend': {
    label: '🎨 Web Frontend',
    stacks: ['React 19', 'Next.js 15', 'Vue 3', 'Svelte', 'Nuxt 3']
  },
  'web-backend': {
    label: '⚙️ Web Backend',
    stacks: ['Node.js + Express', 'Next.js API Routes', 'Python + FastAPI', 'Django', 'Go + Gin']
  },
  'fullstack': {
    label: '🔗 Fullstack',
    stacks: ['Next.js + TypeScript', 'React + Node.js', 'MEVN Stack', 'Django + React', 'Remix + Node.js']
  },
  'mobile': {
    label: '📱 Mobile',
    stacks: ['React Native + Expo', 'Flutter', 'React Native + TypeScript', 'Ionic + React', 'SwiftUI + Firebase']
  },
  'ai-tools': {
    label: '🤖 AI Tools',
    stacks: ['Next.js + OpenAI SDK', 'Next.js + Anthropic', 'Python + OpenAI', 'Streamlit + Claude', 'FastAPI + LangChain']
  },
  'saas': {
    label: '💼 SaaS',
    stacks: ['Next.js + Supabase + Stripe', 'React + Firebase + Stripe', 'Django + PostgreSQL + Stripe', 'Flask + SQLAlchemy', 'Remix + Prisma + Auth0']
  },
  'database': {
    label: '🗄️ Database',
    stacks: ['PostgreSQL + Prisma', 'MongoDB + Mongoose', 'MySQL + TypeORM', 'Firebase Firestore', 'Supabase + PostgreSQL']
  }
}

export default function QuickStackRecommendation({ onSelectStack, onClose }: QuickStackRecommendationProps) {
  const language = useStore(s => s.language)
  const t = translations[language]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-950 via-black to-slate-900 border-2 border-pink-500/50 rounded-3xl p-8 shadow-2xl shadow-pink-500/30">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
              🤖 Expert Recommendation
            </h2>
            <p className="text-slate-400 text-sm">
              {language === 'fr' 
                ? 'Je suis expert en coding. Choisissez une catégorie et je vous recommande le meilleur stack.' 
                : 'I am a coding expert. Choose a category and I recommend the best stack.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-pink-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {Object.entries(STACK_RECOMMENDATIONS).map(([key, { label, stacks }]) => (
            <div key={key} className="bg-black/40 border border-pink-500/20 rounded-2xl p-4 hover:border-pink-500/50 transition-all">
              <h3 className="text-lg font-bold text-pink-400 mb-3">{label}</h3>
              <div className="space-y-2">
                {stacks.map((stack, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectStack(stack)
                      onClose()
                    }}
                    className="w-full text-left px-3 py-2 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-lg hover:border-pink-500/60 hover:bg-pink-500/20 transition-all text-sm text-slate-200 font-medium"
                  >
                    → {stack}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/50 pt-6">
          <p className="text-xs text-slate-500 text-center">
            💡 {language === 'fr' 
              ? 'Ces recommandations sont basées sur mes 10+ années d\'expérience et les dernières tendances 2025.' 
              : 'These recommendations are based on my 10+ years of experience and latest 2025 trends.'}
          </p>
        </div>
      </div>
    </div>
  )
}
