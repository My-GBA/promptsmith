import { NextResponse } from 'next/server'
import { buildPrompt } from '../../lib/prompts/buildPrompt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { vibe, template, fields, mode = 'local', language = 'fr' } = body

    const basePrompt = buildPrompt({ vibe, template, fields, language })

    // Return the base prompt - improvement is now done client-side via openaiClient.ts
    return NextResponse.json({ prompt: basePrompt })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: 500 })
  }
}
