import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlborIA Prisma — Referencias de diseño para tu IA",
  description:
    "Galería de las mejores referencias visuales de UI/UX con sus tokens de diseño y un SKILL.md listo para que tu agente de IA diseñe con buen gusto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
