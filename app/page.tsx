export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <textarea
          aria-label="Skrivytan"
          autoFocus
          placeholder="var ska man skriva?"
          className="h-48 w-full max-w-2xl resize-none border-0 bg-transparent text-center text-[clamp(1.05rem,1.35vw,1.35rem)] leading-[1.55] tracking-[-0.02em] outline-none placeholder:text-[var(--ink-muted)]"
          spellCheck={false}
        />
      </section>
    </main>
  )
}
