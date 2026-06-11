'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';

const navLinks = [
  { href: '/compare', label: 'Compare' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/journal', label: 'Journal' },
  { href: '/competitions', label: 'Competitions' },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white">
            P
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            ProPro
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hidden rounded-lg border border-white/10 px-4 py-1.5 text-sm font-medium text-white/60 transition-all hover:border-white/30 hover:text-white sm:inline-block">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold transition-all hover:bg-gold/20">
                Get Started
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'h-8 w-8',
                  userButtonPopoverCard: 'bg-black border border-white/10',
                },
              }}
            />
          </Show>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 md:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="glass-card absolute left-4 right-4 top-16 mt-2 rounded-xl border p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <hr className="my-2 border-white/5" />
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5">
                  Sign In
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}