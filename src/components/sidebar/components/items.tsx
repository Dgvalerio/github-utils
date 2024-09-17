import { FC, PropsWithChildren, useMemo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/tailwind/utils';

import { cva } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

interface ItemsProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    link?: string;
    onClick?: () => void;
    disabled?: boolean;
  }[];
  className?: HTMLDivElement['className'];
}

const linkVariants = cva('w-full', {
  variants: {
    isCollapsed: {
      true: 'h-9 w-9',
      false: 'justify-start',
    },
    active: {
      true: 'dark:bg-muted dark:hover:bg-muted dark:hover:text-white',
      false: '',
    },
  },
  compoundVariants: [
    {
      isCollapsed: true,
      active: true,
      className: 'dark:text-muted-foreground',
    },
    {
      isCollapsed: false,
      active: true,
      className: 'dark:text-white ',
    },
  ],
});

const ButtonWrapper: FC<
  {
    active: boolean;
    isCollapsed: boolean;
    link?: ItemsProps['links'][number]['link'];
    onClick?: ItemsProps['links'][number]['onClick'];
    disabled?: ItemsProps['links'][number]['disabled'];
  } & PropsWithChildren
> = ({ active, isCollapsed, link, onClick, children, disabled }) => (
  <Button
    variant={active ? 'default' : 'ghost'}
    size={isCollapsed ? 'icon' : 'sm'}
    className={linkVariants({ isCollapsed, active })}
    onClick={onClick}
    asChild={!onClick && !disabled}
    disabled={disabled}
  >
    {onClick || disabled ? (
      children
    ) : (
      <Link href={link ?? '#'}>{children}</Link>
    )}
  </Button>
);
const Item: FC<
  ItemsProps['links'][number] & { isCollapsed: boolean; pathname: string }
> = ({
  link,
  onClick,
  title,
  label,
  icon: Icon,
  pathname,
  isCollapsed,
  disabled,
}) => {
  const active = useMemo(() => pathname === link, [link, pathname]);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger className="w-full">
        <ButtonWrapper
          active={active}
          isCollapsed={isCollapsed}
          link={link}
          onClick={onClick}
          disabled={!!disabled}
        >
          <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
          <span className={isCollapsed ? 'sr-only' : ''}>{title}</span>
          {!isCollapsed && label && (
            <span
              className={cn(
                'ml-auto',
                active && 'text-background dark:text-white'
              )}
            >
              {label}
            </span>
          )}
        </ButtonWrapper>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className={cn('flex items-center gap-4', !isCollapsed && 'hidden')}
      >
        {title}
        {label && (
          <span className="ml-auto text-muted-foreground">{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export const SidebarItems: FC<ItemsProps> = ({
  links,
  isCollapsed,
  className,
}) => {
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
        {links.map((link, index) => (
          <Item
            key={index}
            pathname={pathname}
            isCollapsed={isCollapsed}
            {...link}
          />
        ))}
      </nav>
    </div>
  );
};
