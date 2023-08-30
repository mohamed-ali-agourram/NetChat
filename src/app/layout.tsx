import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Session from './context/Session'
import ToasterContext from './context/Toaster'
import ActiveStatus from './compnents/ActiveStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NetChat',
  description: 'NetChat Messaging app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Session>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </Session>
      </body>
    </html>
  )
}
