'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, BarChart3, User, Settings } from 'lucide-react'

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/create', label: 'Create', icon: Plus },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-surface border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-accent">
            CreatorShare
          </Link>

          <div className="flex items-center gap-6">
            {navigationItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  pathname === href
                    ? 'bg-accent text-text'
                    : 'text-text/80 hover:text-text hover:bg-surface'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <w3m-button />
          </div>
        </div>
      </div>
    </nav>
  )
}

