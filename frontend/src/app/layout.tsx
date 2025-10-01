import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

const fontGeist = V0_Font_Geist({
  weight: ["100","200","300","400","500","600","700","800","900"]
})

const fontGeistMono = V0_Font_Geist_Mono({
  weight: ["100","200","300","400","500","600","700","800","900"]
})

const fontSourceSerif4 = V0_Font_Source_Serif_4({
  weight: ["200","300","400","500","600","700","800","900"]
})


export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
