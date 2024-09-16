import { PropsWithChildren } from 'react';

import type { Metadata, NextPage } from 'next';
import localFont from 'next/font/local';

import '@/styles/globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Github Utils',
  description: 'Github Utils',
};

const RootLayout: NextPage<PropsWithChildren> = ({ children }) => (
  <html lang="pt-br">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
    >
      {children}
    </body>
  </html>
);

export default RootLayout;
