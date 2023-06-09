import React from 'react';

import lang from '../../libs/lang';
import usersApi from '../../store/api/usersApi';
import { getServerSidePropsCustom } from '../../libs/functions';
import { IPage, IUserAndRoles } from '../../libs/types';
import PageMeta from '../../components/Other/PageMeta';
import UpdateUser from '../../components/Forms/User/UpdateUser';
import UpdateUserRoles from '../../components/Forms/User/UpdateUserRoles';
import rolesApi from '../../store/api/rolesApi';

const UserPage: React.FC<IPage<IUserAndRoles>> = ({ meta, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      {content?.user && <UpdateUser data={content.user} />}
      {content?.roles && (
        <UpdateUserRoles
          user={content.user}
          roles={content.roles}
        />
      )}
    </React.Fragment>
  );
};
export default UserPage;

export const getServerSideProps = getServerSidePropsCustom<IUserAndRoles>(
  async ({ store, context }) => {
    const userLang = store.getState().app.userLang;
    const id = Number(context.params?.id);

    if (id) {
      const userReq = await store.dispatch(usersApi.endpoints.findOne.initiate(id));

      if (userReq.data) {
        const rolesReq = await store.dispatch(rolesApi.endpoints.findAll.initiate());

        return {
          props: {
            meta: {
              title: `${lang.get(userLang)?.user}: ${userReq.data.name}`,
              description: `${lang.get(userLang)?.user}: ${userReq.data.name}`,
              h1: userReq.data.name,
            },
            content: {
              user: userReq.data,
              roles: rolesReq.data || [],
            },
          },
        };

      }

    }

    return { notFound: true };
  }
);
