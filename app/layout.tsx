import './globals.css'
import { Inter } from 'next/font/google'
import {SessionProvider, SelectedNoteContextProvider} from './context-providers'
import Nav from './components/nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Notepod',
  description: 'Edit your notes onto a solid server',
}

export default function RootLayout(props: {
  children: React.ReactNode,
  authModal: React.ReactNode,
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <SelectedNoteContextProvider>
          <body className='flex flex-col h-screen max-h-screen'>
            <div className='flex-none'>
              <Nav />
            </div>
            <div className='flex-1 overflow-clip'>
              {props.children}
              {props.authModal}
            </div>
          </body>
        </SelectedNoteContextProvider>
      </SessionProvider>
    </html>
  )
}
