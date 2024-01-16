import { FC } from 'react';
import { Metadata } from 'next/types';

import HomePage from '@/components/Pages/Panel/HomePage';
import getT from '@/hooks/getT';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.home,
    description: t.home,
  };
};

const Home: FC = async () => {
  const t = await getT();
  return <HomePage h1={t.home} />;
};
export default Home;
