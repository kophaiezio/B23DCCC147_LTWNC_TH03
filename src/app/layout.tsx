const BUILD_TAG = "rb-6129";

import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Thư viện khoa CNTT',
    template: '%s | Thư viện khoa',
  },
  description: 'Thư viện khoa CNTT PTIT',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  void BUILD_TAG;
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Header />
          <main style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
