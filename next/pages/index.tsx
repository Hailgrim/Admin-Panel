import React from 'react';

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
  const t = store.getState().app.t;
  return {
    props: {
      meta: {
        title: t.home,
        description: t.home,
        h1: t.home,
      },
    },
  };
});
