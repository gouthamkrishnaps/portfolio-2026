import type { Metadata } from "next";
import "./globals.css";
import { Bebas_Neue, Inter } from "next/font/google";
import ScrollProgress from "../components/ScrollProgress";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      className={`${bebas.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
        <ScrollProgress />
      </body>

    </html>
  );
}
