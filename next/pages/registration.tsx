import React from 'react';

import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
import PageMeta from '../components/Other/PageMeta';
import Registration from '../components/Forms/Auth/Registration';
import dictionary from 'locales/dictionary';

const RegistrationPage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <Registration />
    </React.Fragment>
  );
};
export default RegistrationPage;

export const getServerSideProps = getServerSidePropsCustom<IPage>(
  async ({ store }) => {
    const t = dictionary[store.getState().app.language];
    return {
      props: {
        meta: {
          title: t.signUp,
          description: t.signUp,
          h1: t.signUp,
        },
      },
    };
  }
);
