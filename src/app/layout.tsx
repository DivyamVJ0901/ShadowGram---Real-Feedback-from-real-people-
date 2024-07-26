import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProviders';
import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShadowGram',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
