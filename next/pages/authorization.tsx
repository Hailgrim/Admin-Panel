import React from 'react';

import lang from '../libs/lang';
import { getServerSidePropsCustom } from '../libs/functions';
import { IPage } from '../libs/types';
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
    const userLang = store.getState().app.userLang;
    return {
      props: {
        meta: {
          title: lang.get(userLang)?.signIn,
          description: lang.get(userLang)?.signIn,
          h1: lang.get(userLang)?.signIn,
        },
      },
    };
  }
);
