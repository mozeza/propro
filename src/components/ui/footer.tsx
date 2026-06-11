import Link from 'next/link';

const quickLinks = [
  { href: '/compare', label: 'Compare Firms' },
  { href: '/quiz', label: 'Take Quiz' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/journal', label: 'Journal' },
  { href: '/competitions', label: 'Competitions' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-white">
                P
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                ProPro
              </span>
            </Link>
            <p className="text-xs text-white/40">
              Compare & Save on Top Prop Firms
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/50 transition-colors hover:text-white/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="text-center text-xs text-white/30">
            &copy; 2026 ProPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}