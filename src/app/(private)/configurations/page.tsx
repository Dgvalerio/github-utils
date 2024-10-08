import { NextPage } from 'next';

import { awaiter } from '@/utils/functions/awaiter';

const ConfigurationsPage: NextPage = async () => {
  await awaiter();

  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Configurations</h1>
    </main>
  );
};

export default ConfigurationsPage;
