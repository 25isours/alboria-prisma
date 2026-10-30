import type { Reference } from "./types";

const ROLES = ["Fondo base", "Superficie / paneles", "Texto principal", "Acento"];

export function buildSkillMd(r: Reference): string {
  const palette = r.palette
    .map((hex, i) => `- \`${hex}\` — ${ROLES[i] ?? `Color de apoyo ${i + 1}`}`)
    .join("\n");
  const fonts = r.fonts.map((f) => `- ${f}`).join("\n");
  const tags = r.tags.join(", ");

  return `---
name: diseno-${r.id}
description: Diseña interfaces con el criterio visual de ${r.title} (${r.category}). Úsala al crear UI que deba evitar la estética genérica de IA.
---

# Skill de diseño: ${r.title}

Referencia: ${r.url}
Categoría: ${r.category}
Rasgos: ${tags}

## Resumen
${r.summary}

## Paleta (tokens de color)
${palette}

Define estos valores como variables CSS / tokens del tema y no uses colores fuera de la paleta salvo estados (error, éxito).

## Tipografía
${fonts}

Usa la primera fuente para titulares y elementos distintivos; la segunda para texto corrido. Limita a 2 familias.

## Lección clave
${r.takeaway}

## Reglas de ejecución
1. Aplica la jerarquía con tamaño, peso y contraste antes que con decoración.
2. Bordes de 1px translúcidos en lugar de sombras pesadas; radios pequeños (≤ 6px).
3. Espaciado generoso y consistente sobre una escala de 4px/8px.
4. Movimiento sutil con física de resorte; respeta \`prefers-reduced-motion\`.
5. Cuida el contraste (WCAG AA) y los estados de foco visibles.

## Anti «AI Slop» — evita siempre
- Gradientes morados/violetas genéricos y fondos con orbes difuminados.
- Tarjetas con \`border-radius\` inflado (16px o más) y sombras difusas por defecto.
- Emojis como iconos, copy vacío («Potencia tu flujo de trabajo») y rejillas de tres tarjetas idénticas.
- Mezclar más de dos familias tipográficas o más de un color de acento.
`;
}

export const skillFileName = (r: Reference) => `skill-${r.id}.md`;
