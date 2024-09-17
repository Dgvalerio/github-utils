import { FC } from 'react';

import { useSession } from 'next-auth/react';

import { getAvatarFallback } from '@/components/perfil-menu/perfil-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/tailwind/utils';

export const SidebarUser: FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const { data } = useSession();

  if (!data) return <Skeleton className="h-[52px] w-6 rounded-full" />;

  return (
    <div className={cn('flex h-[52px] items-center justify-center gap-2 px-2')}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.photo} />
        <AvatarFallback>{getAvatarFallback(data.name)}</AvatarFallback>
      </Avatar>
      {!isCollapsed && <span className="mr-auto truncate">{data.name}</span>}
    </div>
  );
};
