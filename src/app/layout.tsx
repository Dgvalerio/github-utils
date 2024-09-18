import { PropsWithChildren } from 'react';

import type { Metadata, NextPage } from 'next';
import { Inter } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { SessionProvider } from '@/components/session-provider/session-provider';
import { ThemeProvider } from '@/components/theme-provider/theme-provider';
import { SonnerToaster } from '@/lib/sonner/sonner';
import { cn } from '@/lib/tailwind/utils';

import '@/styles/globals.css';
import 'material-symbols/rounded.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'GitHub Utils',
  description: 'GitHub Utils',
};

const RootLayout: NextPage<PropsWithChildren> = ({ children }) => (
  <html lang="pt-br">
    <body
      className={cn(
        inter.className,
        `flex h-full max-h-screen flex-col antialiased`
      )}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>{children}</SessionProvider>
        <SonnerToaster />
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
