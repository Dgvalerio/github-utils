import { GitHub } from '@/types/github';
import { View } from '@/types/view';

export const githubToView = {
  repositories(fromGithub: GitHub.Repositories): View.Repository[] {
    return fromGithub.map((from) => ({
      fullName: from.full_name,
      name: from.name,
      ownerLogin: from.owner.login,
      ownerAvatar: from.owner.avatar_url,
    }));
  },
  pullRequests(fromGithub: GitHub.PullRequests): View.PullRequest[] {
    return fromGithub.map((from) => ({
      user: {
        login: from.user?.login || 'Unknown',
        avatar: from.user?.avatar_url || 'https://picsum.photos/16',
      },
      createdAt: new Date(from.created_at).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      state: from.state,
      title: from.title,
      body: from.body,
      url: from.html_url,
    }));
  },
};
