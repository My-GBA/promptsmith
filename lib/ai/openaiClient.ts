export async function improveWithOpenAIClient(prompt: string, apiKey: string, model: string = 'gpt-4o') {
  if (!apiKey) {
    return `${prompt}\n\n[IA non configurée]`
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: `Améliore et reformule le prompt suivant pour qu'il soit parfait pour un modèle de code:\n\n${prompt}` }],
        max_tokens: 600
      })
    })

    if (!res.ok) {
      const t = await res.text()
      return `${prompt}\n\n[Erreur OpenAI: ${res.status} ${t}]`
    }

    const json = await res.json()
    const text = json?.choices?.[0]?.message?.content
    return text || prompt
  } catch (e) {
    return `${prompt}\n\n[Erreur IA: ${String(e)}]`
  }
}
