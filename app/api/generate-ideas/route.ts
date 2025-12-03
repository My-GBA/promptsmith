import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, openaiKey, openaiModel } = await req.json()

    if (!openaiKey) {
      return NextResponse.json({ error: 'Missing OpenAI key' }, { status: 400 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: openaiModel || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a creative project idea generator. Always respond with valid JSON only, no markdown, no extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'OpenAI API error' }, { status: response.status })
    }

    const content = data.choices[0]?.message?.content || ''
    
    // Parse JSON from response
    let ideas = []
    try {
      ideas = JSON.parse(content)
    } catch (e) {
      // If parsing fails, try to extract JSON from the content
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0])
      }
    }

    return NextResponse.json({ ideas: Array.isArray(ideas) ? ideas : [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
