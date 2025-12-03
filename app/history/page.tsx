"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import useStore from '../../lib/store'
import { translations } from '../../lib/translations'

export default function HistoryPage() {
  const history = useStore(s => s.history)
  const favorites = useStore(s => s.favorites)
  const removeFromHistory = useStore(s => s.removeFromHistory)
  const toggleFavorite = useStore(s => s.toggleFavorite)
  const clearHistory = useStore(s => s.clearHistory)
  const language = useStore(s => s.language)
  const setField = useStore(s => s.setField)
  const setPrompt = useStore(s => s.setPrompt)

  const isFr = language === 'fr'
  const t = translations[language]

  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [copied, setCopied] = useState<string | null>(null)

  const displayedItems = filter === 'favorites' 
    ? history.filter(h => favorites.includes(h.id))
    : history

  function formatDate(timestamp: number) {
    const date = new Date(timestamp)
    return date.toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function copyToClipboard(prompt: string, id: string) {
    navigator.clipboard.writeText(prompt)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  function reloadPrompt(entry: any) {
    setField('idea', entry.idea)
    setField('appType', entry.appType)
    setField('stack', entry.stack)
    setField('complexity', entry.complexity)
    setField('constraints', entry.constraints)
    setPrompt(entry.prompt)
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <Link href="/" className="mb-6 inline-block text-pink-400 hover:text-pink-300 transition-colors">
        ← {isFr ? 'Retour' : 'Back'}
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
          {isFr ? '📜 Historique' : '📜 History'}
        </h1>
        <div className="h-1 bg-gradient-to-r from-pink-500 to-transparent w-32 mb-6" />

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                : 'bg-slate-900/50 text-slate-300 hover:text-white'
            }`}
          >
            {isFr ? 'Tous' : 'All'} ({history.length})
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'favorites'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                : 'bg-slate-900/50 text-slate-300 hover:text-white'
            }`}
          >
            ⭐ {isFr ? 'Favoris' : 'Favorites'} ({favorites.length})
          </button>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm(isFr ? 'Effacer tout ?' : 'Clear all?')) {
                  clearHistory()
                }
              }}
              className="ml-auto px-4 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
            >
              {isFr ? '🗑️ Tout effacer' : '🗑️ Clear All'}
            </button>
          )}
        </div>

        {/* Items */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-3">📭</div>
            <p className="text-slate-400 text-lg">
              {isFr ? 'Aucun prompt trouvé' : 'No prompts found'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedItems.map((entry) => (
              <div
                key={entry.id}
                className="bg-black/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-5 hover:border-pink-500/40 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-1">
                      {formatDate(entry.timestamp)}
                    </div>
                    <h3 className="text-xl font-bold text-pink-300">
                      {entry.idea || (isFr ? 'Sans titre' : 'Untitled')}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleFavorite(entry.id)}
                    className={`ml-3 text-2xl transition-all ${
                      favorites.includes(entry.id) ? '⭐' : '☆'
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-slate-500">{isFr ? 'Type:' : 'Type:'}</span>
                    <div className="text-slate-200 font-mono">{entry.appType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">{isFr ? 'Stack:' : 'Stack:'}</span>
                    <div className="text-slate-200 font-mono">{entry.stack}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">{isFr ? 'Complexité:' : 'Complexity:'}</span>
                    <div className="text-slate-200 font-mono">{entry.complexity}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">{isFr ? 'Contraintes:' : 'Constraints:'}</span>
                    <div className="text-slate-200 font-mono text-xs truncate">{entry.constraints}</div>
                  </div>
                </div>

                {/* Prompt Preview */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 mb-4 max-h-24 overflow-hidden">
                  <p className="text-slate-300 text-sm font-mono whitespace-pre-wrap line-clamp-3">
                    {entry.prompt}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(entry.prompt, entry.id)}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                      copied === entry.id
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {copied === entry.id ? '✓ Copié' : '📋 Copier'}
                  </button>
                  <button
                    onClick={() => reloadPrompt(entry)}
                    className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-all text-sm"
                  >
                    🔄 {isFr ? 'Recharger' : 'Reload'}
                  </button>
                  <button
                    onClick={() => removeFromHistory(entry.id)}
                    className="px-3 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg font-medium transition-all text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
