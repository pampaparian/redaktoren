'use client'

import { useEffect, useState } from 'react'

const TEXT_STORAGE_KEY = 'redaktoren:text'
const STEP_STORAGE_KEY = 'redaktoren:step'

function shouldRevealRedaktören(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.includes('
')) return true
  return /[.!?](?:s|$)/.test(trimmed)
}

export default function Home() {
  const [text, setText] = useState('')
  const [step, setStep] = useState(1)
  const [hydrated, setHydrated] = useState(false)
  const revealed = shouldRevealRedaktören(text)

  useEffect(() => {
    const savedText = sessionStorage.getItem(TEXT_STORAGE_KEY)
    const savedStep = sessionStorage.getItem(STEP_STORAGE_KEY)

    if (savedText !== null) {
      setText(savedText)
    }

    if (savedStep === '2') {
      setStep(2)
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem(TEXT_STORAGE_KEY, text)
  }, [text, hydrated])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem(STEP_STORAGE_KEY, String(step))
  }, [step, hydrated])

  function handleNext() {
    sessionStorage.setItem(TEXT_STORAGE_KEY, text)
    sessionStorage.setItem(STEP_STORAGE_KEY, '2')
    setStep(2)
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-10">
        {step === 1 ? (
          <textarea
            aria-label="Skrivytan"
            autoFocus
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="var ska man skriva?"
            className="h-[28rem] w-full resize-none border-0 bg-transparent text-center text-[clamp(1.02rem,1.3vw,1.32rem)] leading-[1.55] tracking-[-0.02em] outline-none placeholder:text-[var(--ink-muted)] md:h-[32rem]"
            spellCheck={false}
          />
        ) : (
          <div className="flex min-h-[28rem] w-full flex-col items-center justify-center text-center md:min-h-[32rem]">
            <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[var(--ink-muted)]">
              Fortsättning
            </p>
            <p className="mt-4 text-[clamp(0.95rem,1.05vw,1.08rem)] leading-7 text-[var(--ink-soft)]">
              Nästa del av seansen väntar.
            </p>
            <div className="mt-8 w-full max-w-2xl rounded-[1.5rem] border border-[var(--ink-muted)]/15 bg-white/35 px-5 py-4 text-left backdrop-blur-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.34em] text-[var(--ink-muted)]">
                Text som skickades vidare
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[clamp(0.95rem,1.05vw,1.08rem)] leading-7 text-[var(--ink)]">
                {text || 'Ingen text sparad.'}
              </p>
            </div>
          </div>
        )}

        {revealed && step === 1 ? (
          <aside className="mt-28 w-full max-w-xl text-center md:mt-36" aria-live="polite">
            <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[var(--ink-muted)]">
              Redaktören
            </p>
            <p className="mt-4 text-[clamp(0.95rem,1.05vw,1.08rem)] leading-7 text-[var(--ink-soft)]">
              Nu finns rummet.
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-8 inline-flex items-center justify-center border-0 bg-transparent px-4 py-2 text-[0.72rem] uppercase tracking-[0.34em] text-[var(--ink-muted)] outline-none transition-opacity hover:opacity-80 focus-visible:opacity-80"
            >
              Next
            </button>
          </aside>
        ) : null}
      </section>
    </main>
  )
}
