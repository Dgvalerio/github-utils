import { GitHub } from '@/types/github';

import { Octokit } from 'octokit';

export const getTotalRepositories = async (token: string): Promise<number> => {
  const octokit = new Octokit({ auth: token });

  const user = await octokit.rest.users.getAuthenticated();

  if (!user) return 0;

  const response = await octokit.request('GET /user/repos', {
    per_page: 1,
    sort: 'pushed',
  });

  const linkHeader = response.headers.link;

  if (!linkHeader) return response.data.length;

  const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);

  if (!lastPageMatch) return response.data.length;

  return parseInt(lastPageMatch[1], 10);
};

export const loadGithubRepositories = async (
  token: string,
  onProgress: (progress: number) => void
): Promise<GitHub.Repositories> => {
  try {
    onProgress(0);

    const octokit = new Octokit({ auth: token });

    const user = await octokit.rest.users.getAuthenticated();

    if (!user) {
      onProgress(100);

      return [];
    }

    const totalRepositories = await getTotalRepositories(token);

    const get = async (): Promise<GitHub.Repositories> => {
      let aux: GitHub.Repositories = [];

      const request = async (page: number): Promise<void> => {
        const response = await octokit.request('GET /user/repos', {
          per_page: 100,
          sort: 'pushed',
          page,
        });

        onProgress((page / totalRepositories) * 100);

        aux = aux.concat(response.data);

        if (response.headers.link && response.headers.link.includes('last'))
          await request(page + 1);
      };

      await request(1);

      return aux;
    };

    return await get();
  } catch (e) {
    return [];
  }
};

export const loadGithubPullRequests = async (
  token: string,
  repositories: string[]
): Promise<GitHub.PullRequests> => {
  try {
    const octokit = new Octokit({ auth: token });

    const user = await octokit.rest.users.getAuthenticated();

    if (!user) return [];

    const pullsPromise: Promise<GitHub.PullRequests>[] = repositories.map(
      async (repositoryFullName): Promise<GitHub.PullRequests> => {
        const [owner, repo] = repositoryFullName.split('/');

        const pulls = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
          owner,
          repo,
          state: 'open',
          sort: 'updated',
          direction: 'asc',
        });

        return pulls.data;
      }
    );

    const pulls: GitHub.PullRequests[] = await Promise.all(pullsPromise);

    const joinedPulls = pulls.reduce((previousValue, current) =>
      previousValue.concat(current)
    );

    return joinedPulls.sort(
      ({ created_at: previous }, { created_at: current }) => {
        const pDate = new Date(previous);
        const cDate = new Date(current);

        return pDate.getTime() - cDate.getTime();
      }
    );
  } catch (e) {
    return [];
  }
};

export const countGithubOpenedPullRequests = async (
  token: string,
  repositories: string[]
): Promise<number> => {
  try {
    const octokit = new Octokit({ auth: token });

    const user = await octokit.rest.users.getAuthenticated();

    if (!user) return 0;

    const pullCountPromise: Promise<number>[] = repositories.map(
      async (repositoryFullName): Promise<number> => {
        const [owner, repo] = repositoryFullName.split('/');

        const response = await octokit.request(
          'GET /repos/{owner}/{repo}/pulls',
          { per_page: 1, owner, repo, state: 'open' }
        );

        const linkHeader = response.headers.link;

        if (!linkHeader) return response.data.length;

        const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);

        if (!lastPageMatch) return response.data.length;

        return parseInt(lastPageMatch[1], 10);
      }
    );

    const counts: number[] = await Promise.all(pullCountPromise);

    return counts.reduce((previousValue, current) => previousValue + current);
  } catch (e) {
    return 0;
  }
};
