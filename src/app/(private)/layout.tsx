import { PropsWithChildren } from 'react';

import { NextPage } from 'next';

import { Header } from '@/components/header/header';
import { ResizableProvider } from '@/components/resizable-provider/resizable-provider';
import { SideBar } from '@/components/sidebar/sidebar';
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';

interface PrivateLayoutProps extends PropsWithChildren {}

const PrivateLayout: NextPage<PrivateLayoutProps> = ({ children }) => (
  <TooltipProvider delayDuration={0}>
    <ResizableProvider>
      <SideBar />
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={76} minSize={64}>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex max-h-[calc(100vh-53px)] w-full flex-1 flex-col gap-4 overflow-auto p-4">
            {children}
          </main>
        </div>
      </ResizablePanel>
    </ResizableProvider>
  </TooltipProvider>
);

export default PrivateLayout;
