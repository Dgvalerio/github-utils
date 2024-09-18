import { GitHub } from '@/types/github';

export namespace View {
  export interface Repository {
    fullName: GitHub.Repository['full_name'];
    name: GitHub.Repository['name'];
    ownerLogin: GitHub.Repository['owner']['login'];
    ownerAvatar: GitHub.Repository['owner']['avatar_url'];
  }

  export interface Branch {
    name: GitHub.Branch['name'];
    sha: GitHub.Branch['commit']['sha'];
  }

  export interface Commit {
    repo: Repository['fullName'];
    date: string;
    description: GitHub.Commit['commit']['message'];
    commit: GitHub.Commit['html_url'];
  }

  export interface PullRequest {
    user: {
      login: NonNullable<GitHub.PullRequest['user']>['login'];
      avatar: NonNullable<GitHub.PullRequest['user']>['avatar_url'];
    };
    createdAt: GitHub.PullRequest['created_at'];
    state: GitHub.PullRequest['state'];
    title: GitHub.PullRequest['title'];
    body: GitHub.PullRequest['body'];
    url: GitHub.PullRequest['html_url'];
  }
}
