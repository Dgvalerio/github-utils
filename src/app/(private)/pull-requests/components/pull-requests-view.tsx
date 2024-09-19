'use client';

import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { ReloadIcon } from '@radix-ui/react-icons';

import { PullRequestsRepositoriesView } from '@/app/(private)/pull-requests/components/repositories-view';
import { usePullRequestsStore } from '@/app/(private)/pull-requests/pull-requests.store';
import { getAvatarFallback } from '@/components/perfil-menu/perfil-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { loadGithubPullRequests } from '@/lib/octokit/load-github';
import { cn } from '@/lib/tailwind/utils';
import { View } from '@/types/view';
import { githubToView } from '@/utils/mappers/github-to-view';

import { ExternalLink } from 'lucide-react';
import htmlRender from 'rehype-raw';

type ActiveUsers = Record<string, { avatar: string; active: boolean }>;

export const PullRequestsItemsView: FC = () => {
  const { data } = useSession();
  const { repositories } = usePullRequestsStore();

  const [loading, setLoading] = useState(true);
  const [pullRequests, setPullRequests] = useState<View.PullRequest[]>([]);
  const [users, setUsers] = useState<ActiveUsers>({});

  const loadPullRequests = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (!data) return setPullRequests([]);

      const pulls = await loadGithubPullRequests(data.token, repositories);

      const pullUsers: ActiveUsers = {};

      pulls.forEach((pull) => {
        const user = pull.user;

        if (!user || pullUsers[user.login]) return;

        pullUsers[user.login] = {
          avatar: user.avatar_url,
          active: true,
        };
      });

      setUsers(pullUsers);

      setPullRequests(githubToView.pullRequests(pulls));
    } catch (e) {
      setPullRequests([]);
    } finally {
      setLoading(false);
    }
  }, [data, repositories]);

  const toggleUserActive = (userLogin: string): void => {
    setUsers((prev) => ({
      ...prev,
      [userLogin]: { ...prev[userLogin], active: !prev[userLogin].active },
    }));
  };

  useEffect(() => {
    void loadPullRequests();
  }, [loadPullRequests]);

  return (
    <>
      <div className="flex flex-col items-stretch gap-2 md:flex-row">
        {repositories.length > 0 && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="ml-auto h-auto min-h-10 md:m-0"
                  disabled={loading}
                  onClick={loadPullRequests}
                >
                  <ReloadIcon
                    className={cn('h-4 w-4', loading && 'animate-spin')}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Recarregar pull requests</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <PullRequestsRepositoriesView />
      </div>
      <Separator />
      {pullRequests.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold">Usuários:</span>
            {loading &&
              [...new Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-7 w-7 rounded-full" />
              ))}
            {!loading &&
              Object.entries(users).map(([login, data]) => (
                <Avatar
                  className={cn(
                    'h-7 w-7 cursor-pointer border-2 transition-all duration-300 active:border-green-600',
                    data.active
                      ? 'border-foreground'
                      : 'border-transparent opacity-80'
                  )}
                  key={login}
                  onClick={toggleUserActive.bind(null, login)}
                >
                  <AvatarImage src={data.avatar} />
                  <AvatarFallback>{getAvatarFallback(login)}</AvatarFallback>
                </Avatar>
              ))}
          </div>
          <Separator />
        </>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading &&
          [...new Array(6)].map((_, index) => (
            <Skeleton key={index} className="min-h-32 w-full" />
          ))}
        {!loading &&
          pullRequests.length > 0 &&
          pullRequests
            .filter((pull) => users[pull.user.login].active)
            .map((pull) => (
              <div
                key={pull.title + pull.user + pull.createdAt}
                className="flex flex-col gap-2 rounded border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={pull.user.avatar} />
                      <AvatarFallback>
                        {getAvatarFallback(pull.user.login)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="mr-auto truncate">{pull.user.login}</span>
                  </div>
                  <div className="ml-auto flex items-center justify-end gap-2">
                    <span className="text-foreground">{pull.createdAt}</span>
                    <Button size="icon" variant="outline" asChild>
                      <Link href={pull.url} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold">{pull.title}</h1>
                  <Badge
                    className="h-8 border-green-600 text-base text-green-600"
                    variant="outline"
                  >
                    {pull.state}
                  </Badge>
                </div>
                <Separator />
                <Markdown
                  rehypePlugins={[htmlRender]}
                  components={{
                    h1: ({ children }): ReactElement => (
                      <h1 className="text-2xl">{children}</h1>
                    ),
                    h2: ({ children }): ReactElement => (
                      <h2 className="text-xl">{children}</h2>
                    ),
                    h3: ({ children }): ReactElement => (
                      <h3 className="text-lg">{children}</h3>
                    ),
                    p: ({ children }): ReactElement => <p>{children}</p>,
                    a: ({ children, href }): ReactElement => (
                      <Button asChild variant="link">
                        <Link href={href || '#'} target="_blank">
                          {children}
                        </Link>
                      </Button>
                    ),
                  }}
                >
                  {pull.body}
                </Markdown>
              </div>
            ))}
      </div>
    </>
  );
};
