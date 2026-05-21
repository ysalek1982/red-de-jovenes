import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { globalSearch, type SearchResult } from '../../features/search/searchService'
import { useAuth } from '../../features/auth/useAuth'

export function GlobalSearch() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      globalSearch(query, user?.id)
        .then(setResults)
        .catch(() => setResults([]))
    }, 220)

    return () => window.clearTimeout(timer)
  }, [query, user?.id])

  return (
    <div className="relative min-w-0 flex-1 lg:max-w-md">
      <label className="relative flex h-11 items-center rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white/55">
        <Search className="mr-2 h-4 w-4 flex-none text-white/40" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar en la Red..."
          className="min-w-0 flex-1 bg-transparent font-semibold text-white outline-none placeholder:text-white/35"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Limpiar busqueda"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </label>
      {isOpen && query.trim().length >= 2 ? (
        <div
          className="absolute right-0 top-13 z-50 max-h-96 w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.25rem] border border-white/10 bg-slate-950/97 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
          role="listbox"
          aria-label="Resultados de busqueda"
        >
          {results.length ? (
            results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={result.to}
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl px-3 py-3 transition hover:bg-white/10"
                role="option"
              >
                <p className="text-xs font-black uppercase tracking-wide text-amber-200">
                  {result.type}
                </p>
                <p className="mt-1 text-sm font-bold text-white">{result.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">
                  {result.subtitle}
                </p>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-white/55">
              No encontramos resultados todavia. Prueba con otra palabra.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
