import React from 'react';

import lang from '../libs/lang';
import { getServerSidePropsCustom } from '../libs/functions';
import { IPage } from '../libs/types';
import PageMeta from '../components/Other/PageMeta';

const IndexPage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
    </React.Fragment>
  );
};
export default IndexPage;

export const getServerSideProps = getServerSidePropsCustom(async ({ store }) => {
  const userLang = store.getState().app.userLang;
  return {
    props: {
      meta: {
        title: lang.get(userLang)?.home,
        description: lang.get(userLang)?.home,
        h1: lang.get(userLang)?.home,
      },
    },
  };
});
