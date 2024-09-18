import { GitHub } from '@/types/github';

import { Octokit } from 'octokit';

export const loadGithubRepositories = async (
  token: string
): Promise<GitHub.Repositories> => {
  try {
    const octokit = new Octokit({ auth: token });

    const user = await octokit.rest.users.getAuthenticated();

    if (!user) return [];

    const get = async (): Promise<GitHub.Repositories> => {
      let aux: GitHub.Repositories = [];

      const request = async (page: number): Promise<void> => {
        const response = await octokit.request('GET /user/repos', {
          per_page: 100,
          sort: 'pushed',
          page,
        });

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

    const pullsPromise: Promise<GitHub.PullRequests>[] = repositories.map(
      async (repositoryFullName): Promise<GitHub.PullRequests> => {
        const [owner, repo] = repositoryFullName.split('/');

        const pulls = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
          owner,
          repo,
          state: 'open',
        });

        return pulls.data;
      }
    );

    const pulls: GitHub.PullRequests[] = await Promise.all(pullsPromise);

    return pulls.reduce(
      (previousValue, current) => previousValue + current.length,
      0
    );
  } catch (e) {
    return 0;
  }
};
