"use client";

import { useEffect, useRef, useState } from "react";
import type { Reference } from "@/lib/types";

const ASPECTS = ["aspect-[4/3]", "aspect-[1/1]", "aspect-[4/5]", "aspect-[16/10]", "aspect-[5/4]"];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export const previewUrl = (r: Reference) =>
  r.image ??
  `https://api.microlink.io/?url=${encodeURIComponent(r.url)}&screenshot=true&meta=false&embed=screenshot.url`;

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Fallback brutalista: nombre en tipografía grande sobre el fondo de la referencia. */
function Wordmark({ r }: { r: Reference }) {
  const [bg, , text, accent] = [r.palette[0], r.palette[1], r.palette[2] ?? "#e8e6e1", r.palette[3] ?? "#f5a524"];
  const size = Math.min(20, 110 / Math.max(r.title.length, 1));
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-4 [container-type:inline-size]"
      style={{ background: bg, color: text }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-50">{hostname(r.url)}</span>
      <p
        className="font-semibold uppercase leading-[0.88] tracking-[-0.045em]"
        style={{ fontSize: `${size}cqw` }}
      >
        {r.title}
        <span style={{ color: accent }}>.</span>
      </p>
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
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const imgRef = useRef<HTMLImageElement>(null);
  const aspect = fixedAspect ?? ASPECTS[(hash(r.id) + index) % ASPECTS.length];

  // La imagen puede terminar de cargar antes de hidratar React.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setStatus(img.naturalWidth > 0 ? "ready" : "failed");
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[4px] border border-white/10 ${aspect} ${className}`}
      style={{ background: r.palette[0] }}
    >
      {/* El wordmark siempre está debajo: es el placeholder mientras carga y el fallback si falla. */}
      <Wordmark r={r} />
      {status !== "failed" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={previewUrl(r)}
          alt={`Vista previa de ${r.title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("failed")}
          className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-500 ${
            status === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
