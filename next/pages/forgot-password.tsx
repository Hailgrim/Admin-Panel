import React from 'react';

import lang from '../lib/lang';
import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
import PageMeta from '../components/Other/PageMeta';
import ForgotPassword from '../components/Forms/Auth/ForgotPassword';

const ForgotPasswordPage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <ForgotPassword />
    </React.Fragment>
  );
};
export default ForgotPasswordPage;

export const getServerSideProps = getServerSidePropsCustom<IPage>(
  async ({ store }) => {
    const userLang = store.getState().app.userLang;
    return {
      props: {
        meta: {
          title: lang.get(userLang)?.forgotPassword,
          description: lang.get(userLang)?.forgotPassword,
          h1: lang.get(userLang)?.forgotPassword,
        },
      },
    };
  }
);
