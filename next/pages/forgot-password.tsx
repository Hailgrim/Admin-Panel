import React from 'react';

import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
import PageMeta from '../components/Other/PageMeta';
import ForgotPassword from '../components/Forms/Auth/ForgotPassword';
import dictionary from 'locales/dictionary';

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
    const t = dictionary[store.getState().app.language];
    return {
      props: {
        meta: {
          title: t.forgotPassword,
          description: t.forgotPassword,
          h1: t.forgotPassword,
        },
      },
    };
  }
);
