"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '../lib/store'
import { translations, Language } from '../lib/translations'

const OPENAI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'Génération haute qualité, bon compromis latence/coût pour tâches complexes' },
  { id: 'gpt-4o-mini', name: 'GPT-4o-mini', desc: 'Version plus légère et rapide de GPT-4o, idéale pour interactions rapides' },
  { id: 'gpt-5-mini', name: 'GPT-5-mini', desc: 'Nouveau modèle mini, conçu pour un bon équilibre performance/coût' }
]

export default function Settings() {
  const router = useRouter()
  const openaiKey = useStore(s => s.openaiKey)
  const setOpenAIKey = useStore(s => s.setOpenAIKey)
  const openaiModel = useStore(s => s.openaiModel)
  const setOpenAIModel = useStore(s => s.setOpenAIModel)
  const language = useStore(s => s.language)
  const setLanguage = useStore(s => s.setLanguage)
  const [openaiKeyLocal, setOpenaiKeyLocal] = useState(openaiKey || '')
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const t = translations[language]

  useEffect(() => {
    setOpenaiKeyLocal(openaiKey || '')
  }, [openaiKey])

  function save() {
    if (openaiKeyLocal) setOpenAIKey(openaiKeyLocal)
    alert(t.keySaved)
  }

  function clearKeys() {
    setOpenaiKeyLocal('')
    setOpenAIKey(null)
  }

  return (
    <div className="space-y-6">
      {/* Language Setting */}
      <div className="bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6">
        <label className="block text-lg font-semibold text-slate-200 mb-3">🌐 {t.languageLabel}</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-full px-4 py-3 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
        >
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      {/* Provider: OpenAI only (Claude removed) */}
      <div className="bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6">
        <label className="block text-lg font-semibold text-slate-200 mb-3">🤖 Provider IA</label>
        <div className="w-full px-4 py-3 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white">
          🟢 OpenAI
        </div>
        <p className="text-sm text-slate-400 mt-2">OpenAI est actuellement utilisé pour les générations IA.</p>
      </div>

      {/* OpenAI Key */}
      <div className="bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6">
        <label className="block text-lg font-semibold text-slate-200 mb-3">🔑 {t.apiKeyLabel} (OpenAI)</label>
        <div className="flex gap-2 mb-2">
          <input
            type={showOpenaiKey ? 'text' : 'password'}
            value={openaiKeyLocal}
            onChange={(e) => setOpenaiKeyLocal(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
            placeholder="sk-..."
          />
          <button
            onClick={() => setShowOpenaiKey(!showOpenaiKey)}
            className="px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-lg text-slate-300 hover:text-pink-400 transition-all"
          >
            {showOpenaiKey ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {language === 'fr'
            ? 'Trouvez votre clé sur https://platform.openai.com/api-keys'
            : 'Find your key at https://platform.openai.com/api-keys'}
        </p>
      </div>

      {/* OpenAI Model Selection */}
      <div className="bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6">
        <label className="block text-lg font-semibold text-slate-200 mb-3">🎯 {language === 'fr' ? 'Modèle GPT' : 'GPT Model'}</label>
        <select
          value={openaiModel}
          onChange={(e) => setOpenAIModel(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900/50 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all mb-3"
        >
          {OPENAI_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <div className="bg-slate-900/50 border border-pink-500/20 rounded-lg p-3">
          {OPENAI_MODELS.find(m => m.id === openaiModel) && (
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-pink-400">
                {OPENAI_MODELS.find(m => m.id === openaiModel)?.name}:
              </span>
              {' '}
              {language === 'fr'
                ? OPENAI_MODELS.find(m => m.id === openaiModel)?.desc.split('-')[0]
                : OPENAI_MODELS.find(m => m.id === openaiModel)?.desc}
            </p>
          )}
        </div>
      </div>

      {/* (Claude removed) */}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={save}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-bold transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
        >
          💾 {t.save}
        </button>
        <button
          onClick={clearKeys}
          className="flex-1 px-6 py-4 bg-slate-800/50 border border-pink-500/30 hover:border-pink-500/60 text-slate-300 hover:text-pink-400 rounded-lg font-bold transition-all duration-200"
        >
          🗑️ {t.clear}
        </button>
      </div>

      {/* Admin Access - Discret */}
      <div className="mt-8 text-left">
        <button
          onClick={() => router.push('/admin-login')}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-200"
        >
          administrateur
        </button>
      </div>
    </div>
  )
}
