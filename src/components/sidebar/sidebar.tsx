'use client';
import { FC, useState } from 'react';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getAvatarFallback } from '@/components/perfil-menu/perfil-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/tailwind/utils';
import { routes } from '@/utils/constants/routes';

import {
  GitPullRequest,
  LucideIcon,
  LogOut,
  LayoutDashboard,
  Wrench,
} from 'lucide-react';

export const UserItem: FC = () => {
  const { data } = useSession();

  if (!data) return <Skeleton className="h-6 w-6 rounded-full" />;

  return (
    <div className="flex w-full items-center gap-2 rounded py-2 pl-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={data.photo} />
        <AvatarFallback>{getAvatarFallback(data.name)}</AvatarFallback>
      </Avatar>
      <span className="mr-auto">{data.name}</span>
    </div>
  );
};

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    link?: string;
    onClick?: () => void;
  }[];
  className?: HTMLDivElement['className'];
}

export const Nav: FC<NavProps> = ({ links, isCollapsed, className }) => {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2',
        className
      )}
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.link ?? '#'}
                  className={cn(
                    buttonVariants({
                      variant: pathname === link.link ? 'default' : 'ghost',
                      size: 'icon',
                    }),
                    'h-9 w-9',
                    pathname === link.link &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.link ?? '#'}
              className={cn(
                buttonVariants({
                  variant: pathname === link.link ? 'default' : 'ghost',
                  size: 'sm',
                }),
                pathname === link.link &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start'
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    'ml-auto',
                    pathname === link.link && 'text-background dark:text-white'
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
};

export const SideBar: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ResizablePanel
      collapsedSize={4}
      collapsible={true}
      minSize={16}
      defaultSize={24}
      maxSize={24}
      onCollapse={() => {
        setIsCollapsed(true);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          true
        )}`;
      }}
      onResize={() => {
        setIsCollapsed(false);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          false
        )}`;
      }}
      className={cn(
        isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out'
      )}
    >
      <div
        className={cn(
          'flex h-[52px] items-center justify-center',
          isCollapsed ? 'h-[52px]' : 'px-2'
        )}
      >
        <UserItem />
      </div>
      <Separator />
      <Nav
        isCollapsed={isCollapsed}
        links={[
          { title: 'Dashboard', icon: LayoutDashboard, link: routes.home },
          {
            title: 'Pull Requests',
            label: '0',
            icon: GitPullRequest,
            link: routes.pullRequests,
          },
          { title: 'Configurações', icon: Wrench, link: routes.configurations },
        ]}
      />
      <Separator />
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: 'Logout',
            label: '',
            icon: LogOut,
            onClick: () => signOut(),
          },
        ]}
      />
    </ResizablePanel>
  );
};
