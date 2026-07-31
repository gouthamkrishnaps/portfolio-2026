import type { Metadata } from "next";
import "./globals.css";
import { Nunito, Outfit } from "next/font/google";
import ThemeProvider from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";
import CustomCursor from "../components/CustomCursor";
import { Analytics } from "@vercel/analytics/react";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gouthamkrishnaps.vercel.app"),
  title: {
    default: "Goutham Krishna P S | Software Engineer & Interactive Developer",
    template: "%s | Goutham Krishna P S",
  },
  description:
    "Portfolio of Goutham Krishna P S, a Software Engineer specializing in building premium, high-performance web applications with React, Next.js, TypeScript, Three.js, and GraphQL.",
  keywords: [
    "Goutham Krishna P S",
    "Goutham Krishna",
    "Software Engineer",
    "Frontend Developer",
    "Full Stack Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Three.js",
    "WebGL",
    "Creative Developer",
    "GraphQL",
    "Portfolio",
    "Kerala",
    "India",
  ],
  authors: [{ name: "Goutham Krishna P S", url: "https://gouthamkrishnaps.vercel.app" }],
  creator: "Goutham Krishna P S",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gouthamkrishnaps.vercel.app",
    title: "Goutham Krishna P S | Software Engineer & Interactive Developer",
    description:
      "Explore the interactive portfolio of Goutham Krishna P S. Premium web experiences engineered with modern technology stacks.",
    siteName: "Goutham Krishna P S Portfolio",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Goutham Krishna P S Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goutham Krishna P S | Software Engineer & Interactive Developer",
    description:
      "Explore the interactive portfolio of Goutham Krishna P S. Premium web experiences engineered with modern technology stacks.",
    images: ["/og-image.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Goutham Krishna P S",
    "jobTitle": "Software Engineer",
    "url": "https://gouthamkrishnaps.vercel.app",
    "sameAs": [
      "https://github.com/gouthamkrishnaps",
      "https://linkedin.com/in/gouthamkrishnaps"
    ],
    "knowsAbout": [
      "React",
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Node.js",
      "Three.js",
      "WebGL",
      "Tailwind CSS",
      "Web Development",
      "Software Engineering"
    ],
    "description": "Software Engineer specializing in React, Next.js, TypeScript, Three.js and GraphQL"
  };

  return (
    <html
      lang="en"
      className={`${nunito.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-foreground">
        <ThemeProvider>
          <CustomCursor />
          <Navbar />
          {children}
          <ScrollProgress />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
