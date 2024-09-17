'use client';

import { ComponentProps, FC } from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/tailwind/utils';

export const ResizableProvider: FC<
  Partial<ComponentProps<typeof ResizablePrimitive.PanelGroup>>
> = ({ children, direction, onLayout, className, ...props }) => (
  <ResizablePanelGroup
    direction={direction ?? 'horizontal'}
    onLayout={
      onLayout ??
      ((sizes: number[]): void => {
        document.cookie = `react-resizable-panels:layout:platform=${JSON.stringify(
          sizes
        )}`;
      })
    }
    className={cn('h-full flex-1 items-stretch', className)}
    {...props}
  >
    {children}
  </ResizablePanelGroup>
);
