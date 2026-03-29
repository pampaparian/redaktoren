import { NextResponse } from 'next/server'

type ChatRole = 'user' | 'assistant'

type IncomingMessage = {
  role: ChatRole
  content: string
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_GENERATIVE_AI_API_KEY saknas i Vercel-miljön.' },
      { status: 503 },
    )
  }

  const body = (await request.json().catch(() => null)) as
    | {
        messages?: unknown
        draftText?: unknown
        step?: unknown
      }
    | null

  const messages = Array.isArray(body?.messages) ? body.messages : []
  const draftText = typeof body?.draftText === 'string' ? body.draftText : ''
  const step = body?.step === 2 ? 2 : 1

  const contents = messages
    .filter(
      (message): message is IncomingMessage =>
        Boolean(
          message &&
            typeof message.content === 'string' &&
            (message.role === 'user' || message.role === 'assistant'),
        ),
    )
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }))

  const systemInstruction = {
    parts: [
      {
        text:
          `Du är den permanenta följdfråge-chatten i Redaktören. ` +
          `Svara kort, konkret och hjälpsamt. Håll dig till nästa steg i skrivandet och kommentera gärna den aktuella texten. ` +
          `Nuvarande steg: ${step}. ` +
          `Aktuell text: ${draftText || 'ingen text än'}.`,
      },
    ],
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction,
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 256,
          },
        }),
      },
    )

    const payload = (await response.json().catch(() => null)) as
      | {
          error?: { message?: string }
          candidates?: Array<{
            content?: {
              parts?: Array<{ text?: string }>
            }
          }>
        }
      | null

    if (!response.ok) {
      throw new Error(payload?.error?.message ?? 'Gemini-svaret misslyckades.')
    }

    const reply = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim()

    return NextResponse.json({
      reply: reply || 'Jag kan hjälpa vidare när du skickar en ny fråga.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gemini gick inte att nå.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
