"use client"
import React from 'react'
import Header from '../components/Header'
import ConversationFull from '../components/ConversationFull'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900">
      <Header />
      <ConversationFull />
    </main>
  )
}
