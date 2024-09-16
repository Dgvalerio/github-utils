import { Icon } from '@/components/icon/icon';
import { cn } from '@/lib/tailwind/utils';

import { toast as t, Toaster } from 'sonner';

export const SonnerToaster: typeof Toaster = ({
  position,
  richColors,
  ...props
}) => (
  <Toaster
    theme="system"
    position={position || 'top-right'}
    richColors={richColors || true}
    {...props}
  />
);

interface Toast {
  error: typeof t.error;
  warning: typeof t.warning;
}

export const toast: Toast = {
  error: (message, data) =>
    t.error(message, {
      ...data,
      className: cn('gap-3', data?.className),
      icon: data?.icon || <Icon icon="error" />,
    }),
  warning: (message, data) =>
    t.warning(message, {
      ...data,
      className: cn('gap-3', data?.className),
      icon: data?.icon || <Icon icon="warning" />,
    }),
};
