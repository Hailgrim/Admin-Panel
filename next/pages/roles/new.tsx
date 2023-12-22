import React from 'react';

import { getServerSidePropsCustom } from '../../lib/functions';
import { IPage } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import CreateRole from '../../components/Forms/Role/CreateRole';
import dictionary from 'locales/dictionary';

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
    const t = dictionary[store.getState().app.language];
    return {
      props: {
        meta: {
          title: t.newRole,
          description: t.newRole,
          h1: t.newRole,
        },
      },
    };
  }
);
