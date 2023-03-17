import React from 'react';

import lang from '../../libs/lang';
import { getServerSidePropsCustom } from '../../libs/functions';
import { IPage } from '../../libs/types';
import PageMeta from '../../components/Other/PageMeta';

const FilesPage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
    </React.Fragment>
  );
};
export default FilesPage;

export const getServerSideProps = getServerSidePropsCustom<IPage>(async ({ store }) => {
  const userLang = store.getState().app.userLang;
  return {
    props: {
      meta: {
        title: lang.get(userLang)?.files,
        description: lang.get(userLang)?.files,
        h1: lang.get(userLang)?.files,
      },
    },
  };
}); 
