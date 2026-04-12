import { Github, Linkedin } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { BrandWordmark } from '../ui/BrandWordmark'

const socialLinks = [
  { label: 'GitHub Repo', href: 'https://github.com/qzMalekuz/KodeZilla.io', icon: Github },
  {
    label: 'Twitter / X',
    href: 'https://x.com/qzMalekuz',
    icon: function XIcon({ className }: { className?: string }) {
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.26l-4.9-6.42L6.4 22H3.3l7.24-8.28L1 2h6.42l4.43 5.87L18.9 2Zm-1.1 18h1.73L6.46 3.9H4.6L17.8 20Z" />
        </svg>
      )
    },
  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/malekuz-zafar-qadri-6b5405232/', icon: Linkedin },
]

export function Footer() {
  const location = useLocation()

  if (location.pathname === '/') {
    return (
      <footer className="relative overflow-hidden border-t border-white/10 bg-black text-white">
        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-12 px-4 pb-24 pt-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:px-0">
          <div className="space-y-8">
            <a href="/" className="inline-flex items-center gap-3" aria-label="KodeZilla.io home">
              <BrandWordmark className="text-[2.2rem]" tone="light" />
            </a>

            <p className="max-w-xl text-lg leading-relaxed text-neutral-400">
              Open-source competitive programming infrastructure built for developers, hosts, and ranked contest communities.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="footer-social inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-neutral-300 transition duration-200 hover:border-white/20 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end md:pt-12">
            <div className="border-t border-white/10 pt-8">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Credits</p>
              <p className="mt-3 max-w-3xl text-[clamp(1.15rem,2.4vw,1.7rem)] font-medium leading-tight tracking-tight text-neutral-400">
                Built and designed by{' '}
                <a
                  href="https://zafarr.xyz/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-white underline decoration-white/20 underline-offset-4 transition-opacity hover:opacity-80"
                >
                  zafarr.
                </a>
              </p>
              <p className="mt-4 text-sm tracking-wide text-neutral-500">© 2026 KodeZilla.io All Rights Reserved</p>
            </div>
          </div>
        </div>

        <div className="footer-watermark pointer-events-none absolute bottom-0 left-4 z-0 select-none font-brand text-[clamp(5rem,16vw,13rem)] uppercase leading-none text-white/[0.06] md:left-0">
          KodeZilla.io
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-neutral-900 bg-stone-50">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-8 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-0">
        <p>Built for high-signal programming rounds and sharp contest hosting.</p>
        <p className="font-mono text-neutral-900">© 2026 KodeZilla.io</p>
      </div>
    </footer>
  )
}
