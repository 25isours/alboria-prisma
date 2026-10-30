"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ClipboardCopy, ExternalLink, Lightbulb, Type, X } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { buildSkillMd } from "@/lib/skill-md";
import type { Reference } from "@/lib/types";
import { ColorSwatches } from "./ColorSwatches";

interface ReferenceModalProps {
  reference: Reference;
  onClose: () => void;
}

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function ReferenceModal({ reference: r, onClose }: ReferenceModalProps) {
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  const copySkill = async () => {
    const ok = await copyText(buildSkillMd(r));
    setState(ok ? "ok" : "error");
    setTimeout(() => setState("idle"), 2200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
        className="relative my-auto w-full max-w-2xl rounded-[6px] border border-white/10 bg-ink/95 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-[4px] border border-white/10 p-1.5 text-muted transition-colors hover:border-white/25 hover:text-text"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>

        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-amber">{r.category}</p>
        <h2 id="modal-title" className="mt-1 pr-10 text-2xl font-semibold tracking-tight">
          {r.title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{r.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Etiquetas">
          {r.tags.map((t) => (
            <li key={t} className="rounded-[4px] border border-white/10 px-2 py-0.5 text-[11px] text-muted">
              {t}
            </li>
          ))}
        </ul>

        <section className="mt-6" aria-labelledby="paleta">
          <h3 id="paleta" className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
            Paleta · clic para copiar
          </h3>
          <ColorSwatches palette={r.palette} height={72} showLabels />
        </section>

        <section className="mt-6" aria-labelledby="tipografia">
          <h3
            id="tipografia"
            className="mb-2 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted"
          >
            <Type className="size-3.5" strokeWidth={1.75} aria-hidden /> Tipografía recomendada
          </h3>
          <ul className="flex flex-wrap gap-2">
            {r.fonts.map((f, i) => (
              <li key={f} className="glass rounded-[4px] px-3 py-2">
                <span className="block text-lg leading-none">{f}</span>
                <span className="mt-1 block text-[11px] text-muted">
                  {i === 0 ? "Titulares y detalles" : "Texto corrido"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-[6px] border border-amber/30 bg-amber/[0.06] p-4" aria-labelledby="leccion">
          <h3
            id="leccion"
            className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-amber"
          >
            <Lightbulb className="size-3.5" strokeWidth={1.75} aria-hidden /> Lección clave
          </h3>
          <p className="text-[15px] leading-relaxed">{r.takeaway}</p>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <motion.button
            type="button"
            onClick={copySkill}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[6px] bg-amber px-5 py-3 text-sm font-semibold text-[#0b0c10] transition-colors hover:bg-amber-soft"
          >
            {state === "ok" ? (
              <>
                <Check className="size-4" strokeWidth={2.5} aria-hidden /> ¡SKILL.md copiado!
              </>
            ) : state === "error" ? (
              "No se pudo copiar"
            ) : (
              <>
                <ClipboardCopy className="size-4" strokeWidth={2} aria-hidden /> Copiar SKILL.md para tu IA
              </>
            )}
          </motion.button>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-[6px] border border-white/10 px-4 py-3 text-sm text-muted transition-colors hover:border-white/25 hover:text-text"
          >
            Visitar sitio <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden />
          </a>
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          {state === "ok" ? "SKILL.md copiado al portapapeles" : ""}
        </span>
      </motion.div>
    </motion.div>
  );
}
