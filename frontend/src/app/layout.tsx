import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/navigation";

import "./globals.css";

import {
  Geist as V0_Font_Geist,
  Geist_Mono as V0_Font_Geist_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google";
import Footer from "@/components/footer";

const fontGeist = V0_Font_Geist({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fontGeistMono = V0_Font_Geist_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fontSourceSerif4 = V0_Font_Source_Serif_4({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <main className="flex min-h-full w-full flex-col justify-between">
          <Navigation />
          <section className="mt-16 h-full">{children}</section>
          <Footer />

          <Analytics />
        </main>
      </body>
    </html>
  );
}
