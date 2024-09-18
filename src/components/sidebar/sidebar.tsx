'use client';
import { FC, useCallback, useEffect, useState } from 'react';

import { signOut, useSession } from 'next-auth/react';

import { usePullRequestsStore } from '@/app/(private)/pull-requests/pull-requests.store';
import {
  SidebarItems,
  SideBarItemsProps,
} from '@/components/sidebar/components/items';
import { SidebarUser } from '@/components/sidebar/components/user';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { countGithubOpenedPullRequests } from '@/lib/octokit/load-github';
import { cn } from '@/lib/tailwind/utils';
import { routes } from '@/utils/constants/routes';

import { GitPullRequest, LogOut, LayoutDashboard, Wrench } from 'lucide-react';

const useSideBarPullRequests = (): SideBarItemsProps['links'][number] => {
  const { data } = useSession();
  const { repositories } = usePullRequestsStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [pullCount, setPullCount] = useState<number>(0);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      if (!data) return setPullCount(0);

      const total = await countGithubOpenedPullRequests(
        data?.token,
        repositories
      );

      setPullCount(total);
    } catch (e) {
      setPullCount(0);
    } finally {
      setLoading(false);
    }
  }, [data, repositories]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    title: 'Pull Requests',
    label: String(pullCount),
    icon: GitPullRequest,
    link: routes.pullRequests,
    loading,
  };
};

export const SideBar: FC = () => {
  const pullRequests = useSideBarPullRequests();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = (): void => {
    setIsCollapsed(true);
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
      true
    )}`;
  };

  const handleResize = (): void => {
    setIsCollapsed(false);
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
      false
    )}`;
  };

  return (
    <ResizablePanel
      collapsedSize={4}
      collapsible={true}
      minSize={16}
      defaultSize={24}
      maxSize={24}
      onCollapse={handleCollapse}
      onResize={handleResize}
      className={cn(
        isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out'
      )}
    >
      <SidebarUser isCollapsed={isCollapsed} />
      <Separator />
      <SidebarItems
        isCollapsed={isCollapsed}
        links={[
          { title: 'Dashboard', icon: LayoutDashboard, link: routes.home },
          pullRequests,
          {
            title: 'Configurações',
            icon: Wrench,
            link: routes.configurations,
            disabled: true,
          },
        ]}
      />
      <Separator />
      <SidebarItems
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
