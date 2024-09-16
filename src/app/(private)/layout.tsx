import { PropsWithChildren } from 'react';

import { NextPage } from 'next';

import { Header } from '@/components/header/header';

interface PrivateLayoutProps extends PropsWithChildren {}

const PrivateLayout: NextPage<PrivateLayoutProps> = ({ children }) => (
  <>
    <Header />
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
      {children}
    </main>
  </>
);

export default PrivateLayout;
