import React from 'react';

import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
import PageMeta from '../components/Other/PageMeta';
import Registration from '../components/Forms/Auth/Registration';

const RegistrationPage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <Registration />
    </React.Fragment>
  );
};
export default RegistrationPage;

export const getServerSideProps = getServerSidePropsCustom<IPage>(async ({ store }) => {
  const t = store.getState().app.t;
  return {
    props: {
      meta: {
        title: t.signUp,
        description: t.signUp,
        h1: t.signUp,
      },
    }
  };
});
