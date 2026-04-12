import type { PropsWithChildren } from 'react'
import { DottedBackground } from '../ui/DottedBackground'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function PageWrapper({ children }: PropsWithChildren) {
  return (
    <DottedBackground>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 py-12">{children}</main>
      <Footer />
    </DottedBackground>
  )
}
