import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/ui/nav";
import Footer from "@/components/ui/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProPro - Compare & Save on Top Prop Firms",
  description:
    "Compare 50+ top prop trading firms side by side. Get exclusive discounts, track your performance, and find the perfect funded trading program for your style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ClerkProvider>
          <Nav />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}