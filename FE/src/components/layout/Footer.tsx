import { Github, Linkedin, SquareArrowOutUpRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { BrandWordmark } from '../ui/BrandWordmark'

const socialLinks = [
  { label: 'GitHub Repo', href: 'https://github.com/qzMalekuz/KodeZilla.io', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/malekuz-zafar-qadri-6b5405232/', icon: Linkedin },
  { label: 'Portfolio', href: 'https://zafarr.xyz/', icon: SquareArrowOutUpRight },
]

export function Footer() {
  const location = useLocation()

  if (location.pathname === '/') {
    return (
      <footer className="relative overflow-hidden border-t border-white/10 bg-black text-white">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-16">
          <div className="border-b border-white/10 pb-12">
            <a href="/" className="inline-flex items-center gap-3" aria-label="KodeZilla.io home">
              <BrandWordmark className="text-[2.2rem]" tone="light" />
            </a>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-400">
              Open-source competitive programming infrastructure built for developers, hosts, and ranked contest communities.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-neutral-400 transition hover:border-white/20 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Credits</p>
            <p className="mt-3 max-w-3xl text-[clamp(1.15rem,2.4vw,1.75rem)] font-medium leading-tight tracking-tight text-neutral-400">
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

        <div className="pointer-events-none absolute bottom-[-8%] left-6 select-none font-brand text-[clamp(6rem,20vw,18rem)] uppercase leading-none text-white/[0.07]">
          KodeZilla.io
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-neutral-900 bg-stone-50">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-8 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
        <p>Built for high-signal programming rounds and sharp contest hosting.</p>
        <p className="font-mono text-neutral-900">© 2026 KodeZilla.io</p>
      </div>
    </footer>
  )
}
