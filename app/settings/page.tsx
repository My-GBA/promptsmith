"use client"
import React from 'react'
import Link from 'next/link'
import Settings from '../../components/Settings'
import useStore from '../../lib/store'
import { translations } from '../../lib/translations'

export default function SettingsPage() {
  const language = useStore(s => s.language)
  const t = translations[language]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            ⚙️ {(t as any).settingsTitle}
          </h1>
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50">
            ← {(t as any).home}
          </Link>
        </div>
        <Settings />
      </div>
    </main>
  )
}
