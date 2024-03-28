import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'
import GameContextProvider from '@/context/game-context-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tic-Tac-Toe',
  description: 'The classic game coded in Next.js and styled with tailwind'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <GameContextProvider>
          <Header />
          {children}
          <Footer />
        </GameContextProvider>
      </body>
    </html>
  )
}
