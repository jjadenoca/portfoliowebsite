// Root layout — fonts, smooth scroll, reveal observer, nav.
import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/site/SiteNav";
import SmoothScroll from "@/components/site/SmoothScroll";
import RevealObserver from "@/components/site/RevealObserver";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Jaden Oca | Content Creator | @jadeneoca",
  description:
    "Jaden Oca (@jadeneoca) makes content about decision making — 30k+ followers across platforms. Founding Chief Growth Officer at No Dice. Worked with Monarch Money, Blossom Social, Higgsfield AI, and Finvest.",
  metadataBase: new URL("https://jadenoca.com"),
  openGraph: {
    title: "Jaden Oca | Content Creator | @jadeneoca",
    description:
      "Content about decision making — 30k+ followers across platforms. Founding CGO at No Dice. Partnered with Monarch Money, Blossom Social, Higgsfield AI, and more.",
    url: "https://jadenoca.com",
    siteName: "Jaden Oca",
    type: "website",
    images: [
      {
        url: "/headshot.jpeg",
        width: 1200,
        height: 1600,
        alt: "Jaden Oca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaden Oca | Content Creator | @jadeneoca",
    description:
      "Content about decision making — 30k+ followers across platforms. Founding CGO at No Dice.",
    images: ["/headshot.jpeg"],
  },
  icons: {
    icon: "/headshot.jpeg",
    shortcut: "/headshot.jpeg",
    apple: "/headshot.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plusJakartaSans.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <SmoothScroll />
        <RevealObserver />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
