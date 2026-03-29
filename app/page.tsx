'use client'

import { type FormEvent, type RefObject, useEffect, useRef, useState } from 'react'

const SESSION_STORAGE_KEY = 'redaktoren:session-v4'

type Step = 1 | 2
type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

type SessionState = {
  text: string
  step: Step
  messages: ChatMessage[]
}

function shouldRevealRedaktören(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.includes('\n')) return true
  return /[.!?](?:\s|$)/.test(trimmed)
}

function readSessionState(): SessionState | null {
  if (typeof window === 'undefined') return null

  const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<SessionState>
    return {
      text: typeof parsed.text === 'string' ? parsed.text : '',
      step: parsed.step === 2 ? 2 : 1,
      messages: Array.isArray(parsed.messages)
        ? parsed.messages
            .filter(
              (message): message is ChatMessage =>
                Boolean(
                  message &&
                    typeof message.content === 'string' &&
                    (message.role === 'user' || message.role === 'assistant'),
                ),
            )
            .map((message) => ({
              role: message.role,
              content: message.content,
            }))
        : [],
    }
  } catch {
    return null
  }
}

type ChatPanelProps = {
  messages: ChatMessage[]
  draft: string
  sending: boolean
  error: string
  onDraftChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  messagesEndRef: RefObject<HTMLDivElement>
}

function ChatPanel({
  messages,
  draft,
  sending,
  error,
  onDraftChange,
  onSubmit,
  messagesEndRef,
}: ChatPanelProps) {
  return (
    <aside className="fixed bottom-4 left-4 right-4 z-20 rounded-[1.5rem] border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 text-[var(--ink)] shadow-[var(--panel-shadow)] backdrop-blur-md md:left-auto md:right-5 md:w-[22rem]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.42em] text-[var(--ink-muted)]">
            Följdfrågor
          </p>
          <p className="mt-1 text-[0.78rem] leading-5 text-[var(--ink-soft)]">
            En kompakt chat för att hålla sidan aktiv.
          </p>
        </div>
        <span className="rounded-full border border-[var(--panel-border)] px-2 py-1 text-[0.58rem] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Gemini
        </span>
      </div>

      <div className="mt-3 max-h-36 space-y-2 overflow-y-auto rounded-[1.2rem] border border-[var(--panel-border)] bg-[var(--panel-bg-strong)] p-3 text-[0.86rem] leading-6 text-[var(--ink)]">
        {messages.length === 0 ? (
          <p className="text-[var(--ink-muted)]">
            Fråga om ton, struktur, nästa steg eller vad som saknas i texten.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === 'user'
                  ? 'ml-auto max-w-[85%] rounded-2xl bg-[var(--bubble-user-bg)] px-3 py-2 text-[var(--bubble-user-ink)]'
                  : 'max-w-[90%] rounded-2xl border border-[var(--panel-border)] bg-[var(--bubble-assistant-bg)] px-3 py-2 text-[var(--bubble-assistant-ink)]'
              }
            >
              {message.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="mt-3 flex gap-2" onSubmit={onSubmit}>
        <textarea
          aria-label="Gemini-fråga"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Ställ en följdfråga"
          rows={2}
          className="min-h-[3rem] flex-1 resize-none rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg-strong)] px-3 py-2 text-[0.84rem] leading-5 text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[var(--ink-muted)]/30"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="self-end rounded-2xl border border-[var(--panel-border)] px-3 py-2 text-[0.64rem] uppercase tracking-[0.24em] text-[var(--ink-muted)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? '...' : 'Skicka'}
        </button>
      </form>

      {error ? (
        <p className="mt-2 text-[0.72rem] leading-5 text-[var(--error-ink)]">{error}</p>
      ) : null}
    </aside>
  )
}

function StageShell({
  children,
  active,
  className = '',
}: {
  children: React.ReactNode
  active: boolean
  className?: string
}) {
  return (
    <div
      className={[
        'absolute inset-0 transition-all duration-700 ease-out motion-reduce:transition-none',
        active ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        className,
      ].join(' ')}
      aria-hidden={!active}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [text, setText] = useState('')
  const [step, setStep] = useState<Step>(1)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const revealed = shouldRevealRedaktören(text)

  useEffect(() => {
    const saved = readSessionState()
    if (saved) {
      setText(saved.text)
      setStep(saved.step)
      setMessages(saved.messages)
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        text,
        step,
        messages,
      }),
    )
  }, [text, step, messages, hydrated])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages])

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = draft.trim()
    if (!trimmed || sending) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setDraft('')
    setSending(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages,
          draftText: text,
          step,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { reply?: string; error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Kunde inte nå Gemini.')
      }

      const reply = payload?.reply?.trim() || 'Jag kan hjälpa vidare när du skickar en ny fråga.'
      setMessages((current) => [...current, { role: 'assistant', content: reply }])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Något gick fel med chatten.'
      setError(message)
    } finally {
      setSending(false)
    }
  }

  function handleNext() {
    setStep(2)
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-14 pb-44 md:px-10 md:py-16 md:pb-52">
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="text-[0.64rem] uppercase tracking-[0.44em] text-[var(--ink-muted)]">
            ÆR PRESS
          </p>
          <h1 className="mt-5 font-[var(--font-serif-alt)] text-[clamp(2rem,3.4vw,3.4rem)] font-light leading-[1.08] tracking-[-0.05em] text-[var(--ink)]">
            Redaktören
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[clamp(0.96rem,1.06vw,1.12rem)] leading-[1.95] tracking-[-0.01em] text-[var(--ink-soft)]">
            En lugn arbetsyta med luftig typografi, tydlig övergång och en varsam väg från första
            rad till nästa del av seansen.
          </p>
        </div>

        <div className="relative mx-auto mt-14 w-full max-w-5xl min-h-[46rem] md:mt-16 md:min-h-[50rem]">
          <StageShell active={step === 1}>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <div className="w-full rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel-bg)] px-6 py-10 shadow-[var(--panel-shadow)] backdrop-blur-sm md:px-10 md:py-12">
                <textarea
                  aria-label="Skrivytan"
                  autoFocus
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="var ska man skriva?"
                  className="h-[28rem] w-full resize-none border-0 bg-transparent text-center font-[var(--font-serif-alt)] text-[clamp(1.02rem,1.28vw,1.28rem)] leading-[1.9] tracking-[-0.02em] outline-none placeholder:text-[var(--ink-muted)] md:h-[32rem]"
                  spellCheck={false}
                />
              </div>

              {revealed ? (
                <aside
                  className="mt-20 w-full max-w-xl text-center transition-all duration-700 ease-out md:mt-28"
                  aria-live="polite"
                >
                  <p className="text-[0.64rem] uppercase tracking-[0.44em] text-[var(--ink-muted)]">
                    Redaktören
                  </p>
                  <p className="mt-4 text-[clamp(0.96rem,1.05vw,1.08rem)] leading-[2] tracking-[-0.01em] text-[var(--ink-soft)]">
                    Nu finns rummet.
                  </p>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-8 inline-flex items-center justify-center border-0 bg-transparent px-4 py-2 text-[0.72rem] uppercase tracking-[0.34em] text-[var(--ink-muted)] transition-opacity hover:opacity-80 focus-visible:opacity-80"
                  >
                    Next
                  </button>
                </aside>
              ) : null}
            </div>
          </StageShell>

          <StageShell active={step === 2}>
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <p className="text-[0.64rem] uppercase tracking-[0.44em] text-[var(--ink-muted)]">
                Fortsättning
              </p>
              <h2 className="mt-5 font-[var(--font-serif-alt)] text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-[1.15] tracking-[-0.04em] text-[var(--ink)]">
                Nästa del av seansen
              </h2>
              <p className="mt-4 max-w-2xl text-[clamp(0.96rem,1.05vw,1.08rem)] leading-[1.95] tracking-[-0.01em] text-[var(--ink-soft)]">
                Texten nedan behandlas nu som ett typesatt utdrag, med mer luft och mindre känsla
                av rå HTML.
              </p>

              <article className="mt-14 w-full max-w-3xl rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel-bg)] px-7 py-10 text-left shadow-[var(--panel-shadow)] backdrop-blur-sm md:px-10 md:py-12">
                <p className="text-[0.64rem] uppercase tracking-[0.44em] text-[var(--ink-muted)]">
                  Föregående text
                </p>
                <div className="mt-6 whitespace-pre-wrap font-[var(--font-serif-alt)] text-[clamp(1.03rem,1.14vw,1.16rem)] leading-[2.15] tracking-[-0.01em] text-[var(--ink)]">
                  {text || 'Ingen text sparad.'}
                </div>
              </article>
            </div>
          </StageShell>
        </div>
      </section>

      <ChatPanel
        messages={messages}
        draft={draft}
        sending={sending}
        error={error}
        onDraftChange={setDraft}
        onSubmit={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
    </main>
  )
}
