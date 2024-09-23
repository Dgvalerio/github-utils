'use client';

import { FC, useCallback, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { ReloadIcon } from '@radix-ui/react-icons';

import { usePullRequestsStore } from '@/app/(private)/pull-requests/pull-requests.store';
import { Combobox } from '@/components/combobox/combobox';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getTotalRepositories,
  loadGithubRepositories,
} from '@/lib/octokit/load-github';
import { cn } from '@/lib/tailwind/utils';
import { View } from '@/types/view';
import { githubToView } from '@/utils/mappers/github-to-view';

import { Plus } from 'lucide-react';

export const PullRequestsRepositoriesSet: FC = () => {
  const { data } = useSession();

  const { addRepository } = usePullRequestsStore();

  const [repositories, setRepositories] = useState<View.Repository[]>([]);
  const [repository, setRepository] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>(0);

  const loadRepositories = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (!data) return setRepositories([]);

      const count = await getTotalRepositories(data.token);

      setTotal(count);

      const repos = await loadGithubRepositories(
        data.token,
        (progress: number) => console.log({ progress })
      );

      setRepositories(githubToView.repositories(repos));
    } catch (e) {
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  }, [data]);

  const handleAddRepository = (): void => {
    if (!repository) return;

    void addRepository(repository);
  };

  useEffect(() => {
    void loadRepositories();
  }, [loadRepositories]);

  return (
    <div className="flex flex-col items-stretch gap-2 md:flex-row">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              disabled={loading}
              onClick={loadRepositories}
              className="ml-auto md:m-0"
            >
              <ReloadIcon
                className={cn('h-4 w-4', loading && 'animate-spin')}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Recarregar pull requests</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {loading ? (
        <Skeleton className="flex h-10 w-full flex-1 cursor-progress items-center justify-center rounded-md">
          Carregando {total > 0 ? total + ' ' : ''}repositório
          {total !== 1 ? 's' : ''}...
        </Skeleton>
      ) : (
        <Combobox
          loading={loading}
          placeholder="Repositórios"
          containerClassName="flex-1 w-full"
          handleSelect={setRepository}
          items={repositories.map((repository) => ({
            value: repository.fullName,
            label: repository.fullName,
          }))}
        />
      )}
      <Button
        onClick={handleAddRepository}
        className="gap-2"
        disabled={loading}
      >
        <Plus /> Adicionar
      </Button>
    </div>
  );
};
