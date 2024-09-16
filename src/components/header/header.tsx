import { FC } from 'react';

import Link from 'next/link';

import { PerfilMenu } from '@/components/perfil-menu/perfil-menu';
import { ThemeToggleButton } from '@/components/theme-provider/theme-toggle-button';
import { routes } from '@/utils/constants/routes';

export const Header: FC = () => (
  <header className="flex items-center justify-between gap-4 px-4 py-2 shadow-lg">
    <div className="flex items-center gap-2">
      <Link
        href={routes.home}
        className="flex items-center gap-4 font-black uppercase italic text-opacity-80 transition hover:text-opacity-100 dark:text-zinc-100"
      >
        Dashboard
      </Link>
    </div>
    <div className="flex items-center gap-2">
      <PerfilMenu />
      <ThemeToggleButton />
    </div>
  </header>
);
