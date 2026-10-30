"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { SearchX } from "lucide-react";
import { filterReferences } from "@/lib/filter";
import type { Reference } from "@/lib/types";
import { Header } from "./Header";
import { ReferenceCard } from "./ReferenceCard";
import { ReferenceModal } from "./ReferenceModal";

interface GalleryProps {
  items: Reference[];
  categories: string[];
}

export function Gallery({ items, categories }: GalleryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Reference | null>(null);

  const visible = useMemo(
    () => filterReferences(items, query, category),
    [items, query, category],
  );

  return (
    <MotionConfig reducedMotion="user">
      <Header
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        active={category}
        onCategoryChange={setCategory}
        total={items.length}
        shown={visible.length}
      />

      <main className="relative z-10 mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
        {visible.length === 0 ? (
          <div className="mx-auto mt-24 flex max-w-sm flex-col items-center text-center text-muted">
            <SearchX className="size-8 text-amber" strokeWidth={1.5} aria-hidden />
            <p className="mt-4 text-text">Sin resultados</p>
            <p className="mt-1 text-sm">Prueba con otra palabra o quita el filtro de categoría.</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            <AnimatePresence mode="popLayout">
              {visible.map((r, i) => (
                <ReferenceCard
                  key={r.id}
                  reference={r}
                  index={i}
                  archiveIndex={items.indexOf(r)}
                  onOpen={setSelected}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selected && <ReferenceModal key={selected.id} reference={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
