'use client';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';

import {
  GitHubTokenCheck,
  GitHubTokenCheckProps,
} from '@/app/(auth)/sign-in/components/github-token-check';
import { routes } from '@/utils/constants/routes';

const SignInPage: NextPage = () => {
  const checkEmailHandler: GitHubTokenCheckProps['onSuccess'] = async (
    user
  ) => {
    await signIn('github-token', { ...user, callbackUrl: routes.home });
  };

  return (
    <div className="flex flex-col gap-2 text-center">
      <GitHubTokenCheck onSuccess={checkEmailHandler} />
    </div>
  );
};

export default SignInPage;
