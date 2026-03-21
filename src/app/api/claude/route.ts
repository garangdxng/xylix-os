import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages, system, apiKey, useWebSearch } = await req.json()
  
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key provided' }, { status: 400 })
  }

  try {
    const body: any = {
      model: 'claude-opus-4-20250514',
      max_tokens: 4096,
      system: system || '',
      messages,
    }

    if (useWebSearch) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }]
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    const text = data.content
      ?.map((block: any) => (block.type === 'text' ? block.text : ''))
      .filter(Boolean)
      .join('\n') || ''

    return NextResponse.json({ text })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
