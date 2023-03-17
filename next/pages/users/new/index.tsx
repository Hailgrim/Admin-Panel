import React from 'react';

import lang from '../../../libs/lang';
import { getServerSidePropsCustom } from '../../../libs/functions';
import { IPage } from '../../../libs/types';
import PageMeta from '../../../components/Other/PageMeta';
import CreateUser from '../../../components/Forms/User/CreateUser';

const NewUserPage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <CreateUser />
    </React.Fragment>
  );
};
export default NewUserPage;

export const getServerSideProps = getServerSidePropsCustom(
  async ({ store }) => {
    const userLang = store.getState().app.userLang;
    return {
      props: {
        meta: {
          title: lang.get(userLang)?.newUser,
          description: lang.get(userLang)?.newUser,
          h1: lang.get(userLang)?.newUser,
        },
      },
    };
  }
);
