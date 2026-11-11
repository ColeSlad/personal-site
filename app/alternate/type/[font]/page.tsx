import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Alternate from "../../page";
import "../type-preview.css";

const sora = localFont({ src: "../../fonts/Sora-Latin.woff2", variable: "--font-preview", weight: "600 700", display: "swap" });
const outfit = localFont({ src: "../../fonts/Outfit-Latin.woff2", variable: "--font-preview", weight: "600 700", display: "swap" });
const syne = localFont({ src: "../../fonts/Syne-Latin.woff2", variable: "--font-preview", weight: "600 700", display: "swap" });

const previews = {
  sora: { name: "Sora", font: sora, note: "Sharp & technical" },
  outfit: { name: "Outfit", font: outfit, note: "Smooth & geometric" },
  syne: { name: "Syne", font: syne, note: "Wide & expressive" },
};

export const metadata: Metadata = {
  title: "Font experiments — Cole Sladowsky",
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(previews).map((font) => ({ font }));
}

export default async function FontPreview({ params }: { params: Promise<{ font: string }> }) {
  const { font } = await params;
  if (!Object.hasOwn(previews, font)) notFound();
  const preview = previews[font as keyof typeof previews];

  return (
    <div className={`type-preview ${preview.font.variable}`} data-typeface={font}>
      <Alternate />
      <nav className="type-preview-toolbar" aria-label="Font experiments">
        <div className="type-preview-caption"><strong>{preview.name}</strong><span>{preview.note}</span></div>
        <div className="type-preview-options">
          {Object.entries(previews).map(([key, item]) => (
            <Link key={key} href={`/alternate/type/${key}`} scroll={false} aria-current={font === key ? "page" : undefined}>
              {item.name}
            </Link>
          ))}
          <Link href="/alternate" scroll={false}>Original</Link>
        </div>
      </nav>
    </div>
  );
}
