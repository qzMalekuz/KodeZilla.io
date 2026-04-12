import type { PropsWithChildren } from 'react'
import { DottedBackground } from '../ui/DottedBackground'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function PageWrapper({ children }: PropsWithChildren) {
  return (
    <DottedBackground>
      <Navbar />
      <main className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-0 md:py-10">{children}</main>
      <Footer />
    </DottedBackground>
  )
}
