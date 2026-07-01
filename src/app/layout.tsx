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

export const metadata = {
  title: "Goutham Krishna P S | Software Engineer",
  description:
    "Software Engineer specializing in React, Next.js, TypeScript and GraphQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
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
