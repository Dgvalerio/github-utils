import { FC } from 'react';

import { NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/utils/constants/routes';
import { awaiter } from '@/utils/functions/awaiter';

import { GitPullRequest, LucideIcon } from 'lucide-react';
import type { UrlObject } from 'url';

const Item: FC<{
  Icon: LucideIcon;
  link: string | UrlObject;
  title: string;
}> = ({ Icon, link, title }) => (
  <Button
    className="flex h-32 w-32 flex-col items-center gap-1 text-wrap"
    variant="outline"
    asChild
  >
    <Link href={link}>
      <Icon size={48} />
      <span className="text-center font-medium">{title}</span>
    </Link>
  </Button>
);

const HomePage: NextPage = async () => {
  await awaiter();

  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Bem vindo ao sistema!</h1>
      <div className="flex flex-wrap gap-4">
        <Item
          Icon={GitPullRequest}
          link={routes.pullRequests}
          title="Visualizar Pull Requests"
        />
      </div>
    </main>
  );
};

export default HomePage;
