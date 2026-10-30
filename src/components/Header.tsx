"use client";

import { motion } from "framer-motion";
import { Search, Sun, X } from "lucide-react";

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  categories: string[];
  active: string | null;
  onCategoryChange: (c: string | null) => void;
  total: number;
  shown: number;
}

const spring = { type: "spring", stiffness: 500, damping: 32 } as const;

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative whitespace-nowrap rounded-[4px] border px-3 py-1.5 text-[13px] transition-colors ${
        selected
          ? "border-transparent text-[#0b0c10]"
          : "border-white/10 text-muted hover:border-white/20 hover:text-text"
      }`}
    >
      {selected && (
        <motion.span
          layoutId="pill-active"
          transition={spring}
          className="absolute inset-0 rounded-[4px] bg-amber"
        />
      )}
      <span className="relative font-medium">{label}</span>
    </button>
  );
}

export function Header({
  query,
  onQueryChange,
  categories,
  active,
  onCategoryChange,
  total,
  shown,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-dawn/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-[6px] border border-amber/40 bg-amber/10 text-amber"
            >
              <Sun className="size-4" strokeWidth={1.75} />
            </span>
            <div className="leading-tight">
              <h1 className="text-[17px] font-semibold tracking-tight">
                Albor<span className="text-amber">IA</span> Prisma
              </h1>
              <p className="text-[12px] text-muted">
                Referencias de diseño que enseñan buen gusto a tu IA
              </p>
            </div>
          </div>

          <div className="glass flex w-full items-center gap-2 rounded-[6px] px-3 py-2 focus-within:border-amber/60 sm:w-[360px]">
            <Search className="size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar por título, tag, fuente…"
              aria-label="Buscar referencias"
              className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Limpiar búsqueda"
                className="text-muted hover:text-text"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div
            role="group"
            aria-label="Filtrar por categoría"
            className="flex flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
          >
            <Pill label="Todas" selected={active === null} onClick={() => onCategoryChange(null)} />
            {categories.map((c) => (
              <Pill
                key={c}
                label={c}
                selected={active === c}
                onClick={() => onCategoryChange(active === c ? null : c)}
              />
            ))}
          </div>
          <p className="hidden shrink-0 font-mono text-[12px] text-muted sm:block" aria-live="polite">
            {shown}/{total}
          </p>
        </div>
      </div>
    </header>
  );
}
