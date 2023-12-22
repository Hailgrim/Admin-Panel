import React from 'react';

import { getServerSidePropsCustom } from '../lib/functions';
import { IPage } from '../lib/types';
import PageMeta from '../components/Other/PageMeta';
import UpdateProfile from '../components/Forms/Auth/UpdateProfile';
import dictionary from 'locales/dictionary';

const ProfilePage: React.FC<IPage> = ({ meta }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <UpdateProfile />
    </React.Fragment>
  );
};
export default ProfilePage;

export const getServerSideProps = getServerSidePropsCustom(
  async ({ store }) => {
    const t = dictionary[store.getState().app.language];
    return {
      props: {
        meta: {
          title: t.profile,
          description: t.profile,
          h1: t.profile,
        },
      },
    };
  }
);
