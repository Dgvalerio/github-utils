'use client';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/form/form';
import { Button } from '@/components/ui/button';
import { UserSession } from '@/lib/next-auth/user-session.types';

import { Octokit } from 'octokit';
import { z } from 'zod';

const emailCheckSchema = z.object({
  token: z.string().min(4, 'O token deve ser informado.'),
});

type GitHubTokenCheckData = z.infer<typeof emailCheckSchema>;

export interface GitHubTokenCheckProps {
  onSuccess(user: UserSession): void;
}

export const GitHubTokenCheck: FC<GitHubTokenCheckProps> = ({ onSuccess }) => {
  const form = useForm<GitHubTokenCheckData>({
    resolver: zodResolver(emailCheckSchema),
  });

  const [loading, setLoading] = useState(false);

  const submitHandler: SubmitHandler<GitHubTokenCheckData> = async (data) => {
    setLoading(true);
    try {
      const octokit = new Octokit({ auth: data.token });

      const response = await octokit.request('GET /user', {
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      });

      onSuccess({
        id: response.data.node_id,
        email: response.data.email ?? 'E-mail não informado.',
        name: response.data.name ?? 'Nome não informado.',
        photo: response.data.avatar_url,
        token: data.token,
      });
    } catch (e) {
      form.setError('token', { message: 'O token informado é inválido.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form.Root<GitHubTokenCheckData>
      {...form}
      onSubmit={submitHandler}
      className="flex flex-col gap-2"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="text-sm text-zinc-400">
        Insira seu{' '}
        <a
          className="font-bold text-zinc-300 underline"
          href="https://github.com/settings/tokens/new?scopes=user,repo&description=github-utils"
          target="_blank"
          title="clique aqui para gerar o token"
        >
          token github
        </a>{' '}
        para entrar no sistema
      </p>
      <Form.Input<GitHubTokenCheckData>
        placeholder="ghp_abCD01EfGhIjKLmNoPQRStu2vWxYzA3B4c5d"
        name="token"
        containerClassName="flex-1"
        loading={loading}
      />
      <Button type="submit" loading={loading}>
        Checar token
      </Button>
    </Form.Root>
  );
};
