import { FC } from 'react';

import { ThemeToggleButton } from '@/components/theme-provider/theme-toggle-button';

export const Header: FC = () => (
  <header className="flex items-center justify-between gap-4 border-b px-4">
    <div className="ml-auto flex items-center gap-2">
      <ThemeToggleButton className="h-[52px] w-[52px]" />
    </div>
  </header>
);
