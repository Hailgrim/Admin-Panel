import React from 'react';

import { getServerSidePropsCustom } from '../../lib/functions';
import { IPage } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import CreateResource from '../../components/Forms/Resource/CreateResource';
import dictionary from 'locales/dictionary';

const NewResourcePage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <CreateResource />
    </React.Fragment>
  );
};
export default NewResourcePage;

export const getServerSideProps = getServerSidePropsCustom(
  async ({ store }) => {
    const t = dictionary[store.getState().app.language];
    return {
      props: {
        meta: {
          title: t.newResource,
          description: t.newResource,
          h1: t.newResource,
        },
      },
    };
  }
);
