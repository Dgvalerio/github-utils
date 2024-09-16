import { FC, forwardRef, InputHTMLAttributes } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { withLoadingSkeletonAndRef } from '@/hoc/loading-skeleton-hoc';
import { cn } from '@/lib/tailwind/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
}

const InputRef = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

InputRef.displayName = 'Input';

const InputLoading: FC<InputProps> = ({ className }) => (
  <Skeleton
    className={cn('flex h-10 w-full cursor-not-allowed rounded-md', className)}
  />
);

export const Input = withLoadingSkeletonAndRef<InputProps, HTMLInputElement>(
  InputLoading,
  InputRef
);
