import React from 'react';

import lang from '../lib/lang';
import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
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
