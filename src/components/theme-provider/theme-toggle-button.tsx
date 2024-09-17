'use client';
import { FC } from 'react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

import { Moon, Sun } from 'lucide-react';

export const ThemeToggleButton: FC<{
  className?: HTMLDivElement['className'];
}> = ({ className }) => {
  const { setTheme, theme } = useTheme();

  const toggleHandler = (): void =>
    setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleHandler}
      className={className}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:hidden dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute hidden h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:block dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
};
