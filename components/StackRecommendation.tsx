"use client"
import React, { useState } from 'react'
import { translations } from '../lib/translations'
import useStore from '../lib/store'

interface StackRecommendation {
  category: string
  current?: string
  recommended: string
  reason: string
  priority: 'critical' | 'important' | 'nice-to-have'
}

const STACK_RECOMMENDATIONS: Record<string, StackRecommendation[]> = {
  'web-app': [
    {
      category: 'Frontend Framework',
      current: 'React 18.2',
      recommended: 'React 19 + Next.js 15',
      reason: 'Better performance, Server Components, automatic optimization',
      priority: 'important'
    },
    {
      category: 'State Management',
      recommended: 'Zustand + TanStack Query',
      reason: 'Lightweight + powerful async state caching for APIs',
      priority: 'important'
    },
    {
      category: 'Styling',
      recommended: 'Tailwind CSS + Framer Motion',
      reason: 'Modern animations, excellent DX, production-ready',
      priority: 'important'
    },
    {
      category: 'Form Validation',
      recommended: 'Zod + React Hook Form',
      reason: 'Type-safe validation, minimal bundle size',
      priority: 'important'
    },
    {
      category: 'Database',
      recommended: 'Prisma + PostgreSQL',
      reason: 'Type-safe ORM, excellent DX, scalable',
      priority: 'important'
    },
    {
      category: 'Authentication',
      recommended: 'NextAuth.js v5',
      reason: 'Secure, flexible, built for Next.js',
      priority: 'nice-to-have'
    },
    {
      category: 'Testing',
      recommended: 'Vitest + Playwright',
      reason: 'Fast unit tests + reliable E2E testing',
      priority: 'important'
    },
    {
      category: 'API Client',
      recommended: 'TanStack Query + Axios',
      reason: 'Automatic caching, refetching, error handling',
      priority: 'important'
    },
    {
      category: 'Monitoring',
      recommended: 'Sentry + Vercel Analytics',
      reason: 'Production error tracking + user insights',
      priority: 'nice-to-have'
    },
    {
      category: 'Code Quality',
      recommended: 'ESLint + Prettier + Husky',
      reason: 'Automated linting and formatting on commit',
      priority: 'important'
    }
  ],
  'ai-tool': [
    {
      category: 'Backend',
      recommended: 'Next.js API Routes + Server Actions',
      reason: 'Secure API calls, no exposed keys',
      priority: 'critical'
    },
    {
      category: 'AI Integration',
      recommended: 'OpenAI SDK + Anthropic SDK',
      reason: 'Official SDKs with proper error handling',
      priority: 'critical'
    },
    {
      category: 'Streaming',
      recommended: 'AI SDK Streaming + Server-Sent Events',
      reason: 'Real-time responses for better UX',
      priority: 'important'
    },
    {
      category: 'Prompt Management',
      recommended: 'Zod for schema validation',
      reason: 'Ensure valid prompts before sending to AI',
      priority: 'important'
    },
    {
      category: 'Caching',
      recommended: 'Redis or Upstash',
      reason: 'Cache API responses to reduce costs',
      priority: 'important'
    },
    {
      category: 'Rate Limiting',
      recommended: 'Upstash Redis + Custom middleware',
      reason: 'Prevent API abuse and control costs',
      priority: 'critical'
    },
    {
      category: 'Logging',
      recommended: 'Pino or Bunyan',
      reason: 'Structured logging for debugging',
      priority: 'important'
    }
  ],
  'saas': [
    {
      category: 'Frontend',
      recommended: 'Next.js 15 + React 19 + TypeScript',
      reason: 'Enterprise-ready, type-safe, fast',
      priority: 'critical'
    },
    {
      category: 'Backend',
      recommended: 'Next.js API Routes with Middleware',
      reason: 'Unified framework, no context switching',
      priority: 'critical'
    },
    {
      category: 'Database',
      recommended: 'PostgreSQL + Prisma',
      reason: 'Relational data, type-safety, migrations',
      priority: 'critical'
    },
    {
      category: 'Auth',
      recommended: 'NextAuth.js + OAuth',
      reason: 'Industry standard, supports all providers',
      priority: 'critical'
    },
    {
      category: 'Payments',
      recommended: 'Stripe + Supabase Webhooks',
      reason: 'Secure, reliable, fully integrated',
      priority: 'critical'
    },
    {
      category: 'Caching',
      recommended: 'Redis + Next.js Revalidation',
      reason: 'Hybrid caching strategy for scale',
      priority: 'important'
    },
    {
      category: 'Email',
      recommended: 'Resend or SendGrid',
      reason: 'Modern email infrastructure',
      priority: 'important'
    },
    {
      category: 'Analytics',
      recommended: 'PostHog + Mixpanel',
      reason: 'Product analytics + user tracking',
      priority: 'important'
    },
    {
      category: 'Monitoring',
      recommended: 'Sentry + LogRocket',
      reason: 'Error tracking + session replay',
      priority: 'important'
    },
    {
      category: 'Deployment',
      recommended: 'Vercel + GitHub Actions',
      reason: 'Zero-config deployment, atomic deploys',
      priority: 'critical'
    }
  ],
  'mobile': [
    {
      category: 'Framework',
      recommended: 'React Native + Expo',
      reason: 'Single codebase, fast development',
      priority: 'critical'
    },
    {
      category: 'State Management',
      recommended: 'Zustand + TanStack Query',
      reason: 'Works great with React Native',
      priority: 'important'
    },
    {
      category: 'Navigation',
      recommended: 'React Navigation v7',
      reason: 'Best-in-class navigation library',
      priority: 'critical'
    },
    {
      category: 'UI Kit',
      recommended: 'NativeWind + Expo UI Kit',
      reason: 'Tailwind-like styling for React Native',
      priority: 'important'
    },
    {
      category: 'Local Storage',
      recommended: 'AsyncStorage + MMKV',
      reason: 'Lightweight, fast local persistence',
      priority: 'important'
    },
    {
      category: 'Backend',
      recommended: 'Same as web-app backend',
      reason: 'Share API layer with web',
      priority: 'critical'
    }
  ]
}

interface StackRecommendationProps {
  projectType?: string
  onClose?: () => void
}

export default function StackRecommendation({ projectType = 'web-app', onClose }: StackRecommendationProps) {
  const language = useStore(s => s.language)
  const t = translations[language]
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const recommendations = STACK_RECOMMENDATIONS[projectType] || STACK_RECOMMENDATIONS['web-app']

  const priorityColor = {
    critical: 'border-red-500/50 bg-red-500/10',
    important: 'border-yellow-500/50 bg-yellow-500/10',
    'nice-to-have': 'border-green-500/50 bg-green-500/10'
  }

  const priorityLabel = {
    critical: '🔴 Critical',
    important: '🟡 Important',
    'nice-to-have': '🟢 Nice-to-have'
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-950 via-black to-slate-900 border border-pink-500/30 rounded-3xl p-8 shadow-2xl shadow-pink-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
              🤖 Expert Stack Recommendation
            </h2>
            <p className="text-slate-400">AI-powered technology stack for optimal development</p>
          </div>
          <button
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-pink-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedCategory === null
                ? 'border-pink-500 bg-pink-500/10'
                : 'border-slate-700 bg-slate-800/30 hover:border-pink-500/50'
            }`}
          >
            <div className="text-lg font-semibold text-pink-400">📋 All</div>
          </button>
          {Array.from(new Set(recommendations.map(r => r.category))).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === cat
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-slate-700 bg-slate-800/30 hover:border-pink-500/50'
              }`}
            >
              <div className="text-lg font-semibold text-pink-400">{cat}</div>
            </button>
          ))}
        </div>

        {/* Recommendations List */}
        <div className="space-y-4 mb-8">
          {recommendations
            .filter(r => !selectedCategory || r.category === selectedCategory)
            .map((rec, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border-2 transition-all ${priorityColor[rec.priority]}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{rec.category}</h3>
                    <p className="text-sm text-slate-400">{priorityLabel[rec.priority]}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(rec.recommended, `${rec.category}-${idx}`)}
                    className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-all"
                  >
                    {copied === `${rec.category}-${idx}` ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>

                <div className="space-y-2">
                  {rec.current && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-500 font-medium">Current:</span>
                      <code className="px-2 py-1 bg-slate-900/50 rounded text-slate-300">
                        {rec.current}
                      </code>
                      <span className="text-slate-600">→</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 font-bold">Recommended:</span>
                    <code className="px-3 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/50 rounded-lg font-semibold text-pink-300">
                      {rec.recommended}
                    </code>
                  </div>
                  <p className="text-slate-300 mt-3">{rec.reason}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              const allStacks = recommendations
                .map(r => `${r.category}: ${r.recommended}`)
                .join('\n')
              copyToClipboard(allStacks, 'all-stacks')
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-bold transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/50"
          >
            📋 Copy All Recommendations
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-800/50 border border-pink-500/30 hover:border-pink-500/60 text-slate-300 hover:text-pink-400 rounded-lg font-bold transition-all duration-200"
          >
            ✕ Close
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">
            💡 These recommendations are based on industry best practices and modern development standards (2025).
            <br />
            Adapt them to your specific needs and team preferences.
          </p>
        </div>
      </div>
    </div>
  )
}
