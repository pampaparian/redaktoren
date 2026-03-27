export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <textarea
          aria-label="Skrivytan"
          autoFocus
          placeholder="var ska man skriva?"
          className="h-56 w-full max-w-3xl resize-none border-0 bg-transparent text-center text-[clamp(1.4rem,3vw,2.4rem)] leading-tight tracking-[-0.04em] outline-none placeholder:text-[var(--ink-muted)]"
          spellCheck={false}
        />
      </section>
    </main>
  )
}
