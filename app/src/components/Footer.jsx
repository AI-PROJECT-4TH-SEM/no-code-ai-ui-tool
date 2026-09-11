import Link from "next/link"

const productLinks = [
  { label: "Home", href: "/" },
  { label: "Themes", href: "/themes" },
  { label: "Settings", href: "/settings" },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#07080d] text-gray-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(6,182,212,0.12),transparent_28%),radial-gradient(circle_at_90%_100%,rgba(236,72,153,0.1),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              UI_Changer-AI
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-500">
              Turn ordinary website markup into clearer, more accessible interfaces with AI-powered design guidance.
            </p>
            <a
              href="mailto:riteshjha689@gmail.com"
              className="mt-5 inline-flex items-center gap-2 text-sm text-gray-300 transition hover:text-pink-300"
            >
              <span aria-hidden="true">✉</span>
              riteshjha689@gmail.com
            </a>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Explore</h2>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm" aria-label="Footer navigation">
              {productLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Connect</h2>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm">
              <a
                href="https://www.linkedin.com/in/ritesh-jha-436a54346/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-cyan-300"
              >
                <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded bg-cyan-400 text-xs font-bold text-[#071016]">in</span>
                LinkedIn
              </a>
              <Link href="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link>
              <a href="mailto:riteshjha689@gmail.com" className="transition hover:text-white">Contact support</a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} UI_Changer-AI. All rights reserved.</p>
          <p>Designed for better interfaces.</p>
        </div>
      </div>
    </footer>
  )
}
