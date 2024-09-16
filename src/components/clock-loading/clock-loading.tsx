import { FC } from 'react';

import { cva } from 'class-variance-authority';

const pointerVariants = cva(
  'w-[0.2rem] absolute box-border animate-spin border-black dark:border-white',
  {
    variants: {
      pointer: {
        hour: 'border-t-[2rem] h-[3.4rem] [animation-duration:8s]',
        minute: 'border-t-[3rem] h-[5.4rem] [animation-duration:2s]',
      },
    },
  }
);

export const ClockLoading: FC = () => (
  <div className="fixed bottom-0 left-0 right-0 top-0 flex scale-125 items-center justify-center bg-white dark:bg-zinc-950">
    <div
      aria-label="Loading"
      className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-black dark:border-white"
    >
      <div className={pointerVariants({ pointer: 'hour' })} />
      <div className={pointerVariants({ pointer: 'minute' })} />
    </div>
  </div>
);
