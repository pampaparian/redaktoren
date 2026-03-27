'use client'

import { useMemo, useState } from 'react'

type CorpusItem = {
  id: number
  label: string
  note: string
}

type ArchiveEntry = {
  number: number
  title: string
  status: string
  body: string
}

const corpus: CorpusItem[] = [
  { id: 198, label: 'Linear archive logic', note: 'A single directional index through time.' },
  { id: 199, label: 'Scrollable masked corpus', note: 'Sidebar and bottom rails should feel like recovered matter.' },
  { id: 215, label: 'Cream / Oyster white', note: 'Primary daylight field for the foundation.' },
  { id: 221, label: 'Clean slate start', note: 'No inherited clutter, no ornamental residue.' },
  { id: 223, label: 'Night mode', note: 'Wine red ground, pink text, red light.' },
]

const archive: ArchiveEntry[] = [
  {
    number: 1,
    title: 'Opening plate',
    status: 'Blank sheet',
    body: 'The interface begins as an editorial surface, not a dashboard. Everything is reduced to one column, one archive axis, and one severe visual rhythm.',
  },
  {
    number: 2,
    title: 'Corpus intake',
    status: 'Linear order',
    body: 'Fragments are stacked chronologically and remain visible in sequence. No grid cross-talk. No looping navigation. The archive moves forward only.',
  },
  {
    number: 3,
    title: 'Mask and margin',
    status: 'Peripheral matter',
    body: 'The sidebar and bottom rail carry scrollable context with soft masks, so the edges feel preserved rather than cut off.',
  },
]

export default function Home() {
  const [nightMode, setNightMode] = useState(false)
  const [activeEntry, setActiveEntry] = useState<ArchiveEntry | null>(null)

  const theme = nightMode ? 'night' : 'day'
  const visibleCorpus = useMemo(() => corpus, [])

  function resetFoundation() {
    setNightMode(false)
    setActiveEntry(null)
  }

  return (
    <main data-theme={theme} className="min-h-screen transition-colors duration-500">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-4 py-4 lg:px-6 lg:py-6">
        <header className="editor-frame flex items-center justify-between gap-4 rounded-[1.75rem] px-5 py-4 lg:px-7">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[color:var(--accent)]">
              Slot 04
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] lg:text-4xl">
              Redaktören
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNightMode((value) => !value)}
              className="rounded-full border border-[color:var(--rule)] px-4 py-2 text-sm font-medium transition hover:scale-[1.01]"
            >
              {nightMode ? 'Day mode' : 'Night mode'}
            </button>
            <button
              type="button"
              onClick={resetFoundation}
              className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition hover:opacity-90"
            >
              Clean slate
            </button>
          </div>
        </header>

        <section className="grid flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="editor-frame corpus-mask rounded-[1.75rem] p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                Corpus
              </span>
              <span className="text-xs text-[color:var(--accent-soft)]">Scrollable</span>
            </div>
            <div className="space-y-3 overflow-auto pr-2">
              {visibleCorpus.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveEntry({
                      number: item.id,
                      title: item.label,
                      status: 'Point reference',
                      body: item.note,
                    })
                  }
                  className="w-full rounded-2xl border border-[color:var(--rule)] bg-white/35 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/50"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs opacity-70">{item.id}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 opacity-80">{item.note}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="editor-frame rounded-[1.75rem] p-5 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--rule)] pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                  Modern Klassicism
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] lg:text-5xl">
                  High-contrast editorial foundation.
                </h2>
              </div>
              <div className="max-w-xs text-sm leading-6 opacity-80">
                Cream/oyster white by day. Wine red, pink text, and red light by night.
                The structure is intentionally severe, crisp, and linear.
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
              <article className="rounded-[1.5rem] border border-[color:var(--rule)] bg-white/45 p-5 lg:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
                      Archive axis
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                      Linear progression only
                    </h3>
                  </div>
                  <span className="rounded-full border border-[color:var(--rule)] px-3 py-1 text-xs uppercase tracking-[0.25em]">
                    {activeEntry ? `Point ${activeEntry.number}` : 'Empty'}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {(activeEntry ? [activeEntry] : archive).map((entry) => (
                    <button
                      key={entry.number}
                      type="button"
                      onClick={() => setActiveEntry(entry)}
                      className="block w-full rounded-[1.2rem] border border-[color:var(--rule)] bg-[color:var(--bg)]/65 p-4 text-left transition hover:bg-white/60"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.3em] text-[color:var(--accent)]">
                            {entry.status}
                          </p>
                          <h4 className="mt-1 text-lg font-semibold">{entry.title}</h4>
                        </div>
                        <span className="text-sm opacity-70">{entry.number}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 opacity-85">{entry.body}</p>
                    </button>
                  ))}
                </div>
              </article>

              <aside className="rounded-[1.5rem] border border-[color:var(--rule)] bg-white/35 p-5">
                <div className="flex items-center justify-between gap-3 border-b border-[color:var(--rule)] pb-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                    Foundation notes
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--light)] shadow-[0_0_24px_var(--light)]" />
                </div>
                <dl className="mt-4 space-y-4 text-sm leading-6">
                  <div>
                    <dt className="font-semibold">Background</dt>
                    <dd className="opacity-80">Cream / Oyster white as the default field.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Night mode</dt>
                    <dd className="opacity-80">Wine red background, pink text, red light.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Start state</dt>
                    <dd className="opacity-80">Clean slate, no inherited clutter.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Corpus behavior</dt>
                    <dd className="opacity-80">Masked scroll containers on the side and bottom.</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </section>

          <aside className="editor-frame corpus-mask rounded-[1.75rem] p-4 lg:hidden xl:block">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                Corpus rail
              </span>
              <span className="text-xs text-[color:var(--accent-soft)]">Bottom scroll</span>
            </div>
            <div className="space-y-3 overflow-auto pr-2">
              {visibleCorpus.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[color:var(--rule)] bg-white/30 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] opacity-70">{item.id}</p>
                  <p className="mt-2 text-sm font-medium">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 opacity-80">{item.note}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <footer className="editor-frame corpus-mask-x rounded-[1.35rem] px-5 py-4">
          <div className="flex min-w-max items-center gap-3 overflow-x-auto pb-1 text-sm">
            {visibleCorpus.map((item) => (
              <button
                key={`rail-${item.id}`}
                type="button"
                onClick={() => setActiveEntry({ number: item.id, title: item.label, status: 'Corpus rail', body: item.note })}
                className="whitespace-nowrap rounded-full border border-[color:var(--rule)] bg-white/40 px-4 py-2 transition hover:bg-white/60"
              >
                {item.id} · {item.label}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </main>
  )
}
