import React from 'react';

import lang from '../../lib/lang';
import { getServerSidePropsCustom } from '../../lib/functions';
import { IPage } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import CreateRole from '../../components/Forms/Role/CreateRole';

const NewRolePage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <CreateRole />
    </React.Fragment>
  );
};
export default NewRolePage;

export const getServerSideProps = getServerSidePropsCustom(
  async ({ store }) => {
    const userLang = store.getState().app.userLang;
    return {
      props: {
        meta: {
          title: lang.get(userLang)?.newRole,
          description: lang.get(userLang)?.newRole,
          h1: lang.get(userLang)?.newRole,
        },
      },
    };
  }
);
