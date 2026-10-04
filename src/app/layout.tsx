import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio of Alok Srivastava",
  description: "Portfolio of Alok Srivastava, Backend Developer specializing in Java, Spring Boot, React, and reactive microservices.",
  icons: {
    icon: "/favicon.png",
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
