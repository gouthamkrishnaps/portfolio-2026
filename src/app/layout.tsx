import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import ThemeProvider from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
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
      className={`${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          {children}
          <ScrollProgress />
        </ThemeProvider>
      </body>

    </html>
  );
}
