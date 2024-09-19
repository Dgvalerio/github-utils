'use client';

import { FC } from 'react';

import { usePullRequestsStore } from '@/app/(private)/pull-requests/pull-requests.store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { AlertCircle, X } from 'lucide-react';

export const PullRequestsRepositoriesView: FC = () => {
  const { repositories: selectedRepositories, removeRepository } =
    usePullRequestsStore();

  const handleRemoveRepository = (repositoryName: string): void => {
    void removeRepository(repositoryName);
  };

  if (selectedRepositories.length === 0)
    return (
      <h2 className="flex flex-1 flex-wrap gap-2 font-light">
        <AlertCircle /> Selecione um repositório para visualizar os Pull
        Requests
      </h2>
    );

  return (
    <div className="flex flex-1 flex-col justify-between gap-2">
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
    </div>
  );
};
