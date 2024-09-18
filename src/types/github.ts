import { Endpoints } from '@octokit/types';

export namespace GitHub {
  export type PullRequests =
    Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'];

  export type PullRequest = PullRequests[number];

  export type Repositories = Endpoints['GET /user/repos']['response']['data'];

  export type Repository = Repositories[number];

  export type Branches =
    Endpoints['GET /repos/{owner}/{repo}/branches']['response']['data'];

  export type Branch = Branches[number];

  export type Commits =
    Endpoints['GET /repos/{owner}/{repo}/commits']['response']['data'];

  export type Commit = Commits[number];
}
