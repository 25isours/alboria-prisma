"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { copyText } from "@/lib/clipboard";

interface ColorSwatchesProps {
  palette: string[];
  height?: number;
  showLabels?: boolean;
  /** Tira continua tipo muestra de película / Pantone con tooltip HEX al hover. */
  strip?: boolean;
}

function isLight(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export function ColorSwatches({ palette, height = 56, showLabels = false, strip = false }: ColorSwatchesProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    if (await copyText(hex)) {
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
    }
  };

  if (strip) {
    return (
      <div className="flex border border-white/10" style={{ height }}>
        {palette.map((hex) => (
          <button
            key={hex}
            type="button"
            onClick={() => copy(hex)}
            aria-label={`Copiar color ${hex}`}
            style={{ backgroundColor: hex }}
            className="group relative h-full flex-1 outline-offset-1"
          >
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-white/15 bg-dawn px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-text opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {copied === hex ? "COPIADO ✓" : hex.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden rounded-[4px] border border-white/10" style={{ height }}>
      {palette.map((hex) => {
        const done = copied === hex;
        return (
          <button
            key={hex}
            type="button"
            onClick={() => copy(hex)}
            aria-label={`Copiar color ${hex}`}
            title={`Copiar ${hex}`}
            style={{ backgroundColor: hex }}
            className="group relative flex-1 transition-[flex-grow] duration-300 hover:flex-[2.2] focus-visible:flex-[2.2]"
          >
            <span
              className={`absolute inset-x-0 bottom-1 text-center font-mono text-[10px] leading-none transition-opacity ${
                showLabels || done ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              } ${isLight(hex) ? "text-black/80" : "text-white/85"}`}
            >
              {done ? <Check className="mx-auto size-3" strokeWidth={2.5} /> : hex.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
