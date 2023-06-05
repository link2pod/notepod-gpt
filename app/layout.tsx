import './globals.css'
import { Inter } from 'next/font/google'
import {SessionProvider } from './context-providers'
import Nav from './nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Notepod',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>
          <Nav />
          <div className='pt-10 max-w-7xl sm:p-10'>
            {children}
          </div>
        </body>
      </SessionProvider>
    </html>
  )
}
