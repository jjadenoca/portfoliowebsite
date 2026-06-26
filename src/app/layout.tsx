import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import SiteNav from "@/components/site/SiteNav";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Jaden Oca | Content Creator | @jadeneoca",
  description:
    "Jaden Oca (@jadeneoca) is a stats, psychology, mindset & AI content creator with 15k+ followers across 3 platforms. Worked with brands including Monarch Money, Blossom Social, Higgsfield AI, Polymarket, and Finvest.",
  metadataBase: new URL("https://jadenoca.com"),
  openGraph: {
    title: "Jaden Oca | Content Creator | @jadeneoca",
    description:
      "Stats, psychology, mindset & AI content creator with 15k+ followers across 3 platforms. Partnered with Monarch Money, Blossom Social, Higgsfield AI, and more.",
    url: "https://jadenoca.com",
    siteName: "Jaden Oca",
    type: "website",
    images: [
      {
        url: "/headshot.jpeg",
        width: 1200,
        height: 1500,
        alt: "Jaden Oca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaden Oca | Content Creator | @jadeneoca",
    description:
      "Stats, psychology, mindset & AI content creator with 15k+ followers across 3 platforms.",
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
      className={`${fraunces.variable} ${plusJakartaSans.variable} ${instrumentSerif.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <SiteNav />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
