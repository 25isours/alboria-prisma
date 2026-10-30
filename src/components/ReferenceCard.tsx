"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Reference } from "@/lib/types";
import { ColorSwatches } from "./ColorSwatches";
import { ReferenceCover } from "./ReferenceCover";

interface ReferenceCardProps {
  reference: Reference;
  index: number;
  onOpen: (r: Reference) => void;
}

export function ReferenceCard({ reference: r, index, onOpen }: ReferenceCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32, delay: Math.min(index, 8) * 0.03 }}
      whileHover={{ y: -3 }}
      className="glass mb-4 break-inside-avoid rounded-[6px] p-3 transition-colors hover:border-amber/40"
    >
      <ReferenceCover reference={r} index={index} />
      <div className="mt-2">
        <ColorSwatches palette={r.palette} height={24} />
      </div>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-amber">
        {r.category}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight">{r.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{r.summary}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Etiquetas">
        {r.tags.map((t) => (
          <li
            key={t}
            className="rounded-[4px] border border-white/10 px-2 py-0.5 text-[11px] text-muted"
          >
            {t}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onOpen(r)}
        className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-text transition-colors hover:text-amber"
      >
        Ver detalles
        <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden />
      </button>
    </motion.article>
  );
}
