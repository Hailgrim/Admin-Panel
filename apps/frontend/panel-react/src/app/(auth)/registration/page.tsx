import { Metadata } from 'next/types';
import { FC } from 'react';

import RegistrationPage from '@/views/Auth/RegistrationPage';
import { getT } from '@ap/shared/src/locales';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.signUp,
    description: t.signUp,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <RegistrationPage h1={t.signUp} />;
};
export default Page;
