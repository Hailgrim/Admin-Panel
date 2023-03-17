import React from 'react';

import lang from '../../../libs/lang';
import { getServerSidePropsCustom } from '../../../libs/functions';
import { IPage } from '../../../libs/types';
import PageMeta from '../../../components/Other/PageMeta';
import CreateRole from '../../../components/Forms/Role/CreateRole';

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
