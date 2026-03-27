'use client'

import { useState } from 'react'

function shouldRevealRedaktören(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.includes('\n')) return true
  return /[.!?](?:\s|$)/.test(trimmed)
}

export default function Home() {
  const [text, setText] = useState('')
  const revealed = shouldRevealRedaktören(text)

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-10">
        <textarea
          aria-label="Skrivytan"
          autoFocus
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="var ska man skriva?"
          className="h-72 w-full resize-none border-0 bg-transparent text-center text-[clamp(1.02rem,1.3vw,1.32rem)] leading-[1.55] tracking-[-0.02em] outline-none placeholder:text-[var(--ink-muted)] md:h-80"
          spellCheck={false}
        />

        {revealed ? (
          <aside className="mt-16 w-full max-w-xl text-center md:mt-20" aria-live="polite">
            <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[var(--ink-muted)]">
              Redaktören
            </p>
            <p className="mt-4 text-[clamp(0.95rem,1.05vw,1.08rem)] leading-7 text-[var(--ink-soft)]">
              Nu finns rummet.
            </p>
          </aside>
        ) : null}
      </section>
    </main>
  )
}
