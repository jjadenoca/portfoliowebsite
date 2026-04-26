import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jaden Oca — Data Professional",
  description:
    "Portfolio of Jaden Oca — Associate Business Analyst at Capital One. Data science, ML pipelines, and analytics for SaaS and financial services.",
  metadataBase: new URL("https://jadenoca.com"),
  openGraph: {
    title: "Jaden Oca — Data Professional",
    description:
      "Data scientist & analyst building ML pipelines, KPI analytics, and AI tools for large-scale SaaS products.",
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
    title: "Jaden Oca — Data Professional",
    description:
      "Data scientist & analyst building ML pipelines, KPI analytics, and AI tools.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
