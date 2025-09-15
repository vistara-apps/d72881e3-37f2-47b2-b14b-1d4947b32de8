import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'CreatorShare - Amplify Your Creativity',
  description: 'A Base MiniApp for creators to build communities, share revenue from their content, and remix existing creations.',
  openGraph: {
    title: 'CreatorShare',
    description: 'Amplify your creativity with fair revenue sharing and remix tools.',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/og-image.png',
    'fc:frame:button:1': 'Launch CreatorShare',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
