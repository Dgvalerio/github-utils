'use client';
import { FC, Fragment, useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { ThemeToggleButton } from '@/components/theme-provider/theme-toggle-button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const Header: FC = () => {
  const pathname = usePathname();

  const url = useMemo(
    () =>
      pathname
        .split('/')
        .map((item) => item.replaceAll('-', ' '))
        .filter((item) => !!item),
    [pathname]
  );

  return (
    <header className="flex items-center justify-between gap-4 border-b px-4">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 sm:gap-1">
          <BreadcrumbSeparator />
          {url.map((item, index) => (
            <Fragment key={index + item}>
              <BreadcrumbItem className="capitalize">
                {url.length - 1 === index ? (
                  <BreadcrumbPage>{item}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="/">{item}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {url.length - 1 > index && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggleButton className="h-[52px] w-[52px]" />
      </div>
    </header>
  );
};
