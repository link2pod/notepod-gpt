import './globals.css'
import { Inter } from 'next/font/google'
import {SessionProvider, SolidContextProvider} from './context-providers'
import Nav from './nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
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
        <SolidContextProvider>
          <body>
            <Nav />
            <div className='mt-10'>
              {children}
            </div>
          </body>
        </SolidContextProvider>
      </SessionProvider>
    </html>
  )
}
