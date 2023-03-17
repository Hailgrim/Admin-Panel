import React from 'react';

import lang from '../libs/lang';
import { getServerSidePropsCustom } from '../libs/functions';
import { IPage } from '../libs/types';
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
  const userLang = store.getState().app.userLang;
  return {
    props: {
      meta: {
        title: lang.get(userLang)?.signUp,
        description: lang.get(userLang)?.signUp,
        h1: lang.get(userLang)?.signUp,
      },
    }
  };
});
