'use client';

import { NextPage } from 'next';

import { PullRequestsItemsView } from '@/app/(private)/pull-requests/components/pull-requests-view';
import { PullRequestsRepositoriesSet } from '@/app/(private)/pull-requests/components/repositories-set';
import { Separator } from '@/components/ui/separator';

const PullRequestsPage: NextPage = () => (
  <main className="flex flex-col gap-4">
    <h1 className="text-lg font-semibold">Pull Requests</h1>
    <Separator />
    <PullRequestsRepositoriesSet />
    <Separator />
    <PullRequestsItemsView />
  </main>
);

export default PullRequestsPage;
