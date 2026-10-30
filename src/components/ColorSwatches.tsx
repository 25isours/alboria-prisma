"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { copyText } from "@/lib/clipboard";

interface ColorSwatchesProps {
  palette: string[];
  height?: number;
  showLabels?: boolean;
}

function isLight(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export function ColorSwatches({ palette, height = 56, showLabels = false }: ColorSwatchesProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    if (await copyText(hex)) {
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
    }
  };

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
