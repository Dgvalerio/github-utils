'use client';
import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { ReloadIcon } from '@radix-ui/react-icons';

import { usePullRequestsStore } from '@/app/(private)/pull-requests/pull-requests.store';
import { Combobox } from '@/components/combobox/combobox';
import { getAvatarFallback } from '@/components/perfil-menu/perfil-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  loadGithubPullRequests,
  loadGithubRepositories,
} from '@/lib/octokit/load-github';
import { View } from '@/types/view';
import { githubToView } from '@/utils/mappers/github-to-view';

import { AlertCircle, ExternalLink, Plus, X } from 'lucide-react';
import htmlRender from 'rehype-raw';

const PullRequestsView: FC<{
  repositories: View.Repository['fullName'][];
}> = ({ repositories }) => {
  const { data } = useSession();

  const [loading, setLoading] = useState(true);
  const [pullRequests, setPullRequests] = useState<View.PullRequest[]>([]);

  const loadPullRequests = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (!data) return setPullRequests([]);

      const pulls = await loadGithubPullRequests(data.token, repositories);

      setPullRequests(githubToView.pullRequests(pulls));
    } catch (e) {
      setPullRequests([]);
    } finally {
      setLoading(false);
    }
  }, [data, repositories]);

  useEffect(() => {
    void loadPullRequests();
  }, [loadPullRequests]);

  if (loading) return <>Loading...</>;

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {pullRequests.length > 0 &&
        pullRequests.map((pull) => (
          <div
            key={pull.title}
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
            <div className="flex items-center justify-between gap-2">
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
  );
};

const PullRequestsPage: NextPage = () => {
  const { data } = useSession();

  const {
    repositories: selectedRepositories,
    addRepository,
    removeRepository,
  } = usePullRequestsStore();

  const [repositories, setRepositories] = useState<View.Repository[]>([]);
  const [repository, setRepository] = useState<string>();
  const [loading, setLoading] = useState(true);

  const loadRepositories = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (!data) return setRepositories([]);

      const repos = await loadGithubRepositories(data.token);

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

  const handleRemoveRepository = (repositoryName: string): void => {
    void removeRepository(repositoryName);
  };

  useEffect(() => {
    void loadRepositories();
  }, [loadRepositories]);

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Pull Requests</h1>
        <Button onClick={loadRepositories} className="gap-2" disabled={loading}>
          <ReloadIcon /> Recarregar
        </Button>
      </div>
      <Separator />
      <div className="flex items-center gap-2">
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
        <Button
          onClick={handleAddRepository}
          className="gap-2"
          disabled={loading}
        >
          <Plus /> Adicionar
        </Button>
      </div>
      <Separator />
      {selectedRepositories.length > 0 && (
        <>
          <h2 className="font-bold">Visualizando pull requests de:</h2>
          <div className="flex flex-wrap gap-2">
            {selectedRepositories.map((repository) => (
              <Badge className="gap-2 pr-1" key={repository}>
                {repository}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto w-auto p-0"
                  onClick={handleRemoveRepository.bind(null, repository)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Badge>
            ))}
          </div>
        </>
      )}
      {selectedRepositories.length === 0 && (
        <h2 className="flex flex-wrap gap-2 font-light">
          <AlertCircle /> Selecione um repositório para visualizar os Pull
          Requests
        </h2>
      )}
      <Separator />
      <PullRequestsView
        repositories={selectedRepositories.map((repository) => repository)}
      />
    </main>
  );
};

export default PullRequestsPage;
