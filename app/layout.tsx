import './globals.css'
import { Inter } from 'next/font/google'
import {SessionProvider, SelectedNoteContextProvider, ToastContextProvider} from './context-providers'
import Nav from './components/nav'
import ToastContainer from './components/toast-container'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Notepod',
  description: 'Edit your notes onto a solid server',
}

export default function RootLayout(props: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <SessionProvider>
      <ToastContextProvider>
        <body className='flex flex-col h-screen max-h-screen'>
          <div className='fixed z-[100] overflow-clip right-0 top-0'>
            <ToastContainer />
          </div>
          <SelectedNoteContextProvider>
            <div className='flex-none'>
              <Nav />
            </div>
            <div className='flex-1 overflow-clip'>
              {props.children}
            </div>
          </SelectedNoteContextProvider>
        </body>
      </ToastContextProvider>
      </SessionProvider>
    </html>
  )
}
