import type { Metadata, Viewport } from 'next';
import { Inter, Roboto } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { InvoiceProvider } from '@/components/invoice-provider';
import { MobileShell } from '@/components/mobile-shell';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'SnapPay — Invoice before you leave the venue',
  description: 'Mobile invoicing for wedding photographers. Get paid faster from the field.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#faf8f5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} h-full`}>
      <body className="min-h-full antialiased">
        <InvoiceProvider>
          <MobileShell>{children}</MobileShell>
          <Toaster position="top-center" richColors closeButton />
        </InvoiceProvider>
      </body>
    </html>
  );
}
