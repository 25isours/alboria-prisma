"use client";

import { useState } from "react";
import type { Reference } from "@/lib/types";

type Variant = "dashboard" | "terminal" | "editorial";

const ASPECTS = ["aspect-[4/3]", "aspect-[1/1]", "aspect-[4/5]", "aspect-[16/10]", "aspect-[5/4]"];

const ASCII = [
  "░▒▓█ ▓▒░ ░▒▓█ ▓▒░",
  "┌──────────────┐",
  "│ > init prism │",
  "└──────────────┘",
  "·:+*#%@%#*+:·",
  "01 10 11 00 01 10",
];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function pickVariant(r: Reference): Variant {
  if (/ascii|sci-fi/i.test(r.category)) return "terminal";
  if (/tabla|datos|densidad|diagram/i.test(r.category)) return "dashboard";
  if (/lujo|identidad|asim|brutal/i.test(r.category)) return "editorial";
  return (["dashboard", "terminal", "editorial"] as const)[hash(r.id) % 3];
}

interface Tones {
  bg: string;
  surface: string;
  text: string;
  accent: string;
}

function Dashboard({ t }: { t: Tones }) {
  return (
    <div className="absolute inset-4 flex gap-2">
      <div className="w-1/4 space-y-1.5 rounded-[4px] p-2" style={{ background: t.surface }}>
        {[70, 55, 62, 48].map((w, i) => (
          <div key={i} className="h-1.5 rounded-[2px]" style={{ width: `${w}%`, background: i === 0 ? t.accent : t.text, opacity: i === 0 ? 1 : 0.35 }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex-1 rounded-[4px] p-2" style={{ background: t.surface }}>
              <div className="h-1 w-1/2 rounded-[2px]" style={{ background: t.text, opacity: 0.35 }} />
              <div className="mt-2 h-3 w-2/3 rounded-[2px]" style={{ background: i ? t.text : t.accent, opacity: i ? 0.8 : 1 }} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1 rounded-[4px] p-2" style={{ background: t.surface }}>
          {[40, 65, 35, 80, 55, 90, 60, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-[2px]" style={{ height: `${h}%`, background: i === 5 ? t.accent : t.text, opacity: i === 5 ? 1 : 0.28 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Terminal({ t, seed }: { t: Tones; seed: number }) {
  const lines = Array.from({ length: 7 }, (_, i) => ASCII[(seed + i) % ASCII.length]);
  return (
    <div className="absolute inset-4 overflow-hidden rounded-[4px] p-3 font-mono text-[11px] leading-[1.5]" style={{ background: t.surface, color: t.text }}>
      <div className="mb-2 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full" style={{ background: i === 0 ? t.accent : t.text, opacity: i === 0 ? 1 : 0.3 }} />
        ))}
      </div>
      <pre className="whitespace-pre opacity-70" aria-hidden>
        {lines.join("\n")}
      </pre>
      <p style={{ color: t.accent }} aria-hidden>
        {"> "}
        <span className="inline-block h-3 w-1.5 translate-y-0.5 animate-pulse" style={{ background: t.accent }} />
      </p>
    </div>
  );
}

function Editorial({ t, title }: { t: Tones; title: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5" style={{ color: t.text }}>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">
        <span>Nº {String(hash(title) % 90 + 10)}</span>
        <span className="h-px flex-1 mx-3" style={{ background: t.text, opacity: 0.4 }} />
        <span style={{ color: t.accent, opacity: 1 }}>●</span>
      </div>
      <p className="text-[clamp(28px,5vw,44px)] font-semibold leading-[0.95] tracking-[-0.03em]">
        {title}
        <span style={{ color: t.accent }}>.</span>
      </p>
      <div className="h-1 w-10 rounded-[2px]" style={{ background: t.accent }} />
    </div>
  );
}

interface ReferenceCoverProps {
  reference: Reference;
  index?: number;
  className?: string;
  fixedAspect?: string;
}

export function ReferenceCover({ reference: r, index = 0, className = "", fixedAspect }: ReferenceCoverProps) {
  const [failed, setFailed] = useState(false);
  const [bg, surface, text, accent] = [
    r.palette[0],
    r.palette[1] ?? r.palette[0],
    r.palette[2] ?? "#e8e6e1",
    r.palette[3] ?? r.palette[2] ?? "#f5a524",
  ];
  const tones: Tones = { bg, surface, text, accent };
  const aspect = fixedAspect ?? ASPECTS[(hash(r.id) + index) % ASPECTS.length];
  const base = `relative w-full overflow-hidden rounded-[4px] border border-white/10 ${aspect} ${className}`;

  if (r.image && !failed) {
    return (
      <div className={base} style={{ background: bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={r.image}
          alt={`Vista previa de ${r.title}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    );
  }

  const variant = pickVariant(r);
  return (
    <div className={base} style={{ background: bg }} role="img" aria-label={`Vista previa abstracta de ${r.title}`}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${text} 1px, transparent 1px), linear-gradient(90deg, ${text} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="absolute -right-10 -top-10 size-40 rounded-full opacity-25 blur-3xl"
        style={{ background: accent }}
      />
      {variant === "dashboard" && <Dashboard t={tones} />}
      {variant === "terminal" && <Terminal t={tones} seed={hash(r.id)} />}
      {variant === "editorial" && <Editorial t={tones} title={r.title} />}
    </div>
  );
}
