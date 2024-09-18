import { GitHub } from '@/types/github';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Store {
  repositories: GitHub.Repository['full_name'][];
  addRepository: (repositoryName: string) => void;
  removeRepository: (repositoryName: string) => void;
}

export const usePullRequestsStore = create<Store>()(
  persist(
    (set) => ({
      repositories: [],
      addRepository: (repositoryName: string): void =>
        set((prevState) => {
          const repo = prevState.repositories.find(
            (repository) => repository === repositoryName
          );

          if (repo) return prevState;

          return {
            repositories: prevState.repositories.concat(repositoryName),
          };
        }),
      removeRepository: (repositoryName: string): void =>
        set((prevState) => {
          const repositories = prevState.repositories.filter(
            (repository) => repository !== repositoryName
          );

          return { repositories };
        }),
    }),
    { name: 'github-utils:pull-requests-storage' }
  )
);
