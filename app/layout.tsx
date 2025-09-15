import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorShare - Fair Revenue Sharing & Remix Tools',
  description: 'Amplify your creativity with fair revenue sharing and remix tools for creators.',
  openGraph: {
    title: 'CreatorShare',
    description: 'Amplify your creativity with fair revenue sharing and remix tools.',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_APP_URL}/api/frame`,
    'fc:frame:button:1': 'Explore Content',
    'fc:frame:button:2': 'Create Content',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_APP_URL}/api/frame`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-bg text-text min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

