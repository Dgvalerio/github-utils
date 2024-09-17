/* eslint-disable @typescript-eslint/ban-types */

export interface IUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface ISimpleUser {
  name: string;
  email: string;
  date: string;
}

export interface ILinks {
  self: {};
  html: {};
  issue: {};
  comments: {};
  review_comments: {};
  review_comment: {};
  commits: {};
  statuses: {};
}

export interface IBase {
  label: string;
  ref: string;
  sha: string;
  user: IUser;
  repo: {};
}

export interface IBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection: {
    required_status_checks: {
      enforcement_level: string;
      contexts: string[];
    };
  };
  protection_url: string;
}

export type IBranchView = IBranch['name'];

export interface ICollaborator {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
  role_name: string;
}

export type ICollaboratorView = Pick<ICollaborator, 'login' | 'avatar_url'>;

export interface ICommitTree {
  sha: string;
  url: string;
}

export interface ICommitVerification {
  verified: boolean;
  reason: 'valid' | 'unsigned';
  signature: string | null;
  payload: string | null;
}

export interface ISimpleCommit {
  author: ISimpleUser;
  committer: ISimpleUser;
  message: string;
  tree: ICommitTree;
  url: string;
  comment_count: 0;
  verification: ICommitVerification;
}

export interface IParent {
  sha: string;
  url: string;
  html_url: string;
}

export interface ICommit {
  sha: string;
  node_id: string;
  commit: ISimpleCommit;
  url: string;
  html_url: string;
  comments_url: string;
  author: IUser;
  committer: IUser;
  parents: IParent[];
}

export interface ICommitView {
  repo: string;
  author: { login: string; avatar: string };
  committer: { login: string; avatar: string };
  message: string;
  sha: string;
  url: string;
  committed_at: string;
}

export interface IContributor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
  role_name: string;
}

export type IContributorView = Pick<IContributor, 'login' | 'avatar_url'>;

export interface IHead {
  label: string;
  ref: string;
  sha: string;
  user: IUser;
  repo: {};
}

export interface IPullRequest {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: IUser;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: null;
  merged_at: null;
  merge_commit_sha: string;
  assignee: null;
  assignees: [];
  requested_reviewers: [];
  requested_teams: [];
  labels: [];
  milestone: null;
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: IHead;
  base: IBase;
  _links: ILinks;
  author_association: string;
  auto_merge: null;
  active_lock_reason: null;
}

export interface IPullRequestParams {
  state?: 'open' | 'closed' | 'all';
  sort?: 'created' | 'updated' | 'popularity' | 'long-running';
  direction?: 'asc' | 'desc';
}

export interface IPullRequestView {
  repo: string;
  user: {
    login: IPullRequest['user']['login'];
    avatar: IPullRequest['user']['avatar_url'];
  };
  created_at: IPullRequest['created_at'];
  state: IPullRequest['state'];
  title: IPullRequest['title'];
  body: IPullRequest['body'];
  url: IPullRequest['html_url'];
}
