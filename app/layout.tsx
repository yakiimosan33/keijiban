import type { Metadata } from 'next';
import './globals.css';
import RealtimeStatus from '@/components/common/RealtimeStatus';

export const metadata: Metadata = {
  title: 'バイブコーディング掲示板',
  description: 'Anonymous text bulletin board system with real-time updates',
  robots: 'noindex, nofollow',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-zinc-50 font-sans antialiased">
        {children}
        <RealtimeStatus />
      </body>
    </html>
  );
}
