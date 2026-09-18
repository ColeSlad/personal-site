import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DateTime from "../components/DateTime";
import Lookbook from "../components/Lookbook";

export const metadata: Metadata = {
  title: "Lookbook | Cole Sladowsky",
  description: "Photos from campus, travels, and everyday life.",
};

export default function LookbookPage() {
  return (
    <main className="main info-page">
      <header className="header">
        <div className="logo-wrap">
          <Link href="/">
            <Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority />
          </Link>
          <DateTime />
        </div>
      </header>

      <div className="info-content lookbook-content">
        <Lookbook />
      </div>
    </main>
  );
}
