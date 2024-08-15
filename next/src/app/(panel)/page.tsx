import { FC } from 'react';
import { Metadata } from 'next/types';

import HomePage from '@/views/Panel/HomePage';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.home,
    description: t.home,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <HomePage h1={t.home} />;
};
export default Page;
