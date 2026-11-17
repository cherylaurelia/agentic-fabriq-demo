import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mnemiq's quickstart fails at uv sync on Python 3.15 (unofficial)",
  description:
    "A fresh machine gets Python 3.15 from uv, and mnemiq's lock has no wheels for it. One-line fix. Unofficial demo by Cheryl Aurelia.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${newsreader.variable} ${jetbrains.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
