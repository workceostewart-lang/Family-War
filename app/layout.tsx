import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "family-war.fantomzone.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  return {
    title: "Family War — Own the Board",
    description: "A fast, voice-hosted family survey game built for game night on phones, tablets, and PC.",
    metadataBase: new URL(origin),
    applicationName: "Family War",
    manifest: "/family-war.webmanifest",
    icons: { icon: "/family-war-favicon.svg", shortcut: "/family-war-favicon.svg" },
    openGraph: {
      title: "Family War — Own the Board",
      description: "Call the answers. Dodge three strikes. Own the board.",
      type: "website",
      images: [{ url: `${origin}/family-war-og.png`, width: 1200, height: 630, alt: "Family War game board" }],
    },
    twitter: { card: "summary_large_image", title: "Family War", description: "The family game-night showdown.", images: [`${origin}/family-war-og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
