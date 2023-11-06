import React from 'react';

import lang from '../lib/lang';
import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
import PageMeta from '../components/Other/PageMeta';
import UpdateProfile from '../components/Forms/Auth/UpdateProfile';

const ProfilePage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <UpdateProfile />
    </React.Fragment>
  );
};
export default ProfilePage;

export const getServerSideProps = getServerSidePropsCustom(async ({ store }) => {
  const userLang = store.getState().app.userLang;
  return {
    props: {
      meta: {
        title: lang.get(userLang)?.profile,
        description: lang.get(userLang)?.profile,
        h1: lang.get(userLang)?.profile,
      },
    },
  };
});
