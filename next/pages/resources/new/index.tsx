import React from 'react';

import lang from '../../../libs/lang';
import { getServerSidePropsCustom } from '../../../libs/functions';
import { IPage } from '../../../libs/types';
import PageMeta from '../../../components/Other/PageMeta';
import CreateResource from '../../../components/Forms/Resource/CreateResource';

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
    const userLang = store.getState().app.userLang;
    return {
      props: {
        meta: {
          title: lang.get(userLang)?.newResource,
          description: lang.get(userLang)?.newResource,
          h1: lang.get(userLang)?.newResource,
        },
      },
    };
  }
);
