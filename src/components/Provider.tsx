'use client'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import { ReactNode } from 'react'
interface ProviderProps {
  children: ReactNode
}
export default function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
