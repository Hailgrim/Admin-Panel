import React from 'react';

import lang from '../libs/lang';
import { getServerSidePropsCustom } from '../libs/functions';
import { IPage, IUser } from '../libs/types';
import PageMeta from '../components/Other/PageMeta';
import UpdateProfile from '../components/Forms/Auth/UpdateProfile';

const ProfilePage: React.FC<IPage<IUser>> = ({ meta, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      {content && <UpdateProfile data={content} />}
    </React.Fragment>
  );
};
export default ProfilePage;

export const getServerSideProps = getServerSidePropsCustom<IUser>(async ({ store }) => {
  const userLang = store.getState().app.userLang;
  const profile = store.getState().app.profile;
  return {
    props: {
      meta: {
        title: lang.get(userLang)?.profile,
        description: lang.get(userLang)?.profile,
        h1: lang.get(userLang)?.profile,
      },
      content: profile,
    },
  };
});
