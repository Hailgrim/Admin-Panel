import React from 'react';

import { getServerSidePropsCustom } from '../../lib/functions';
import { IPage } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import CreateUser from '../../components/Forms/User/CreateUser';

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
    const t = store.getState().app.t;
    return {
      props: {
        meta: {
          title: t.newUser,
          description: t.newUser,
          h1: t.newUser,
        },
      },
    };
  }
);
