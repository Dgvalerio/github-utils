import {
  IBranch,
  IBranchView,
  ICollaborator,
  ICollaboratorView,
  ICommit,
  ICommitView,
  IContributor,
  IContributorView,
  IPullRequest,
  IPullRequestParams,
  IPullRequestView,
} from '@/lib/api/types';

import axios from 'axios';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const joinLists = <Item>(list: Item[][]): Item[] =>
  list.reduce((previous, current) => previous.concat(current));

export const joinListsWithoutDuplicates = <Item>(
  list: Item[][],
  fieldName: keyof Item
): Item[] =>
  list.reduce((previous, current) => {
    const nonDuplicates = current.filter(
      (curr) =>
        !previous.find(
          (prev) => (curr as any)[fieldName] === (prev as any)[fieldName]
        )
    );

    return previous.concat(nonDuplicates);
  });

export const orderByDate = <Item>(
  list: Item[],
  dateKey: keyof Item,
  ord: 'asc' | 'desc'
): Item[] =>
  list.sort((previous, current) => {
    const p = new Date((previous as any)[dateKey]);
    const c = new Date((current as any)[dateKey]);

    return ord === 'asc'
      ? p.getTime() - c.getTime()
      : c.getTime() - p.getTime();
  });

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// todo

const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: { Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}` },
});

const owner = 'lubysoftware';

const repositories = ['multi-fit-app', 'multi-fit-backend', 'multi-fit-lib'];

// todo

export const getBranches = async (options: {
  repository: string;
}): Promise<IBranchView[]> => {
  let list: IBranchView[];

  if (options.repository) {
    const { data } = await api.get<IBranch[]>(
      `/repos/${owner}/${options.repository}/branches`
    );

    list = data.map(({ name }) => name);
  } else {
    const responsePromise = repositories.map(
      async (repo): Promise<IBranchView[]> => {
        const { data } = await api.get<IBranch[]>(
          `/repos/${owner}/${repo}/branches`
        );

        return data.map(({ name }) => name);
      }
    );

    const items: IBranchView[][] = await Promise.all(responsePromise);

    list = joinLists(items);
  }

  return list.sort((p, c) => {
    if (p > c) return 1;
    if (p < c) return -1;

    return 0;
  });
};

export interface GetCommits {
  author: string;
  since?: string;
  until?: string;
}

export const getCommits = async ({
  author,
  until,
  since,
}: GetCommits): Promise<ICommitView[]> => {
  const commitsPromise = repositories.map(
    async (repo): Promise<ICommitView[]> => {
      const branches = await getBranches({ repository: repo });

      const commitsByBranchPromise = branches.map(async (branch) => {
        let url = `/repos/${owner}/${repo}/commits?sha=${branch}&author=${author}`;

        if (since && since !== '') url += `&since=${since}T00:00:00Z`;
        if (until && until !== '') url += `&until=${until}T23:59:59Z`;

        const { data } = await api.get<ICommit[]>(url);

        return data.map((commit) => ({
          repo,
          message: commit.commit.message,
          author: {
            login: commit.author.login,
            avatar: commit.author.avatar_url,
          },
          committer: {
            login: commit.committer.login,
            avatar: commit.committer.avatar_url,
          },
          sha: commit.sha,
          url: commit.html_url,
          committed_at: commit.commit.author.date,
        }));
      });

      const commitsByBranch: ICommitView[][] = await Promise.all(
        commitsByBranchPromise
      );

      return joinListsWithoutDuplicates(commitsByBranch, 'sha');
    }
  );

  const commits: ICommitView[][] = await Promise.all(commitsPromise);

  const joinedCommits = joinLists(commits);

  const organizedByDate = orderByDate(joinedCommits, 'committed_at', 'asc');

  return organizedByDate.map((commit) => ({
    ...commit,
    committed_at: formatDate(commit.committed_at),
  }));
};

export const getCollaborators = async (): Promise<ICollaboratorView[]> => {
  const responsePromise = repositories.map(
    async (repo): Promise<ICollaboratorView[]> => {
      const { data } = await api.get<ICollaborator[]>(
        `/repos/${owner}/${repo}/collaborators`
      );

      return data.map((item) => ({
        login: item.login,
        avatar_url: item.avatar_url,
      }));
    }
  );

  const items: ICollaboratorView[][] = await Promise.all(responsePromise);

  const joined = joinLists(items);

  const withoutDuplicates: ICollaboratorView[] = [];

  joined.forEach((item) => {
    const exists = withoutDuplicates.find(({ login }) => login === item.login);

    if (!exists) withoutDuplicates.push(item);
  });

  return withoutDuplicates.sort((p, c) => {
    if (p.login > c.login) return 1;
    if (p.login < c.login) return -1;

    return 0;
  });
};

export const getContributors = async (): Promise<IContributorView[]> => {
  const responsePromise = repositories.map(
    async (repo): Promise<IContributorView[]> => {
      const { data } = await api.get<IContributor[]>(
        `/repos/${owner}/${repo}/contributors`
      );

      return data.map((item) => ({
        login: item.login,
        avatar_url: item.avatar_url,
      }));
    }
  );

  const items: IContributorView[][] = await Promise.all(responsePromise);

  const joined = joinLists(items);

  const withoutDuplicates: IContributorView[] = [];

  joined.forEach((item) => {
    const exists = withoutDuplicates.find(({ login }) => login === item.login);

    if (!exists) withoutDuplicates.push(item);
  });

  return withoutDuplicates.sort((p, c) => {
    if (p.login > c.login) return 1;
    if (p.login < c.login) return -1;

    return 0;
  });
};

export const getPullRequests = async (
  params: IPullRequestParams
): Promise<IPullRequestView[]> => {
  const state: IPullRequestParams['state'] = params.state || 'open';
  const sort: IPullRequestParams['sort'] = params.sort || 'created';
  const direction: IPullRequestParams['direction'] = params.direction || 'asc';

  const prsPromise = repositories.map(async (repo) => {
    const { data } = await api.get<IPullRequest[]>(
      `/repos/${owner}/${repo}/pulls?state=${state}&sort=${sort}&direction=${direction}`
    );

    return data
      .filter((pr) => pr.user.login !== 'dependabot[bot]')
      .map((pr) => ({
        repo,
        state: pr.state,
        user: { login: pr.user.login, avatar: pr.user.avatar_url },
        created_at: pr.created_at,
        title: pr.title,
        body: pr.body,
        url: pr.html_url,
      }));
  });

  const prs: IPullRequestView[][] = await Promise.all(prsPromise);

  const joinedPrs = prs.reduce((previousValue, current) =>
    previousValue.concat(current)
  );

  const organizedByDate = joinedPrs.sort(
    ({ created_at: previous }, { created_at: current }) => {
      const pDate = new Date(previous);
      const cDate = new Date(current);

      return pDate.getTime() - cDate.getTime();
    }
  );

  return organizedByDate.map((pr) => ({
    ...pr,
    created_at: new Date(pr.created_at).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));
};
