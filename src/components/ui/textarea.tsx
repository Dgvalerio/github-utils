import { FC, forwardRef, TextareaHTMLAttributes } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { withLoadingSkeletonAndRef } from '@/hoc/loading-skeleton-hoc';
import { cn } from '@/lib/tailwind/utils';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  loading?: boolean;
}

const TextareaRef = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

TextareaRef.displayName = 'Textarea';

const TextareaLoading: FC<TextareaProps> = ({ className }) => (
  <Skeleton
    className={cn(
      'flex min-h-[80px] w-full cursor-not-allowed rounded-md',
      className
    )}
  />
);

export const Textarea = withLoadingSkeletonAndRef<
  TextareaProps,
  HTMLTextAreaElement
>(TextareaLoading, TextareaRef);
