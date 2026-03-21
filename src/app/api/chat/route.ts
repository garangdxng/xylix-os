import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, system, apiKey, model, useWebSearch } = body

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key provided' }, { status: 400 })
    }

    const requestBody: any = {
      model: model || 'claude-opus-4-20250514',
      max_tokens: 4096,
      system: system || '',
      messages
    }

    // Add web search tool for betting and research queries
    if (useWebSearch) {
      requestBody.tools = [
        {
          type: 'web_search_20250305',
          name: 'web_search'
        }
      ]
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    // Extract text from response (handle web search tool use blocks)
    const textParts = data.content
      ?.filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n') || ''

    return NextResponse.json({ text: textParts, raw: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const maxDuration = 60 // Allow up to 60s for Claude + web search
