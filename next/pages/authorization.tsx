import React from 'react';

import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
import PageMeta from '../components/Other/PageMeta';
import Authorization from '../components/Forms/Auth/Authorization';

const AuthorizationPage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <Authorization />
    </React.Fragment>
  );
};
export default AuthorizationPage;

export const getServerSideProps = getServerSidePropsCustom(
  async ({ store }) => {
    const t = store.getState().app.t;
    return {
      props: {
        meta: {
          title: t.signIn,
          description: t.signIn,
          h1: t.signIn,
        },
      },
    };
  }
);
