import React from 'react';

import lang from '../../lib/lang';
import rolesApi from '../../store/api/rolesApi';
import resourcesApi from '../../store/api/resourcesApi';
import { getServerSidePropsCustom } from '../../lib/functions';
import { IPage, IRoleAndResources } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import UpdateRole from '../../components/Forms/Role/UpdateRole';
import UpdateRoleResources from '../../components/Forms/Role/UpdateRoleResources';

const RolePage: React.FC<IPage<IRoleAndResources>> = ({ meta, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      {content?.role && <UpdateRole data={content.role} />}
      {content?.role && !content.role.admin && content.resources && (
        <UpdateRoleResources
          role={content.role}
          resources={content.resources}
        />
      )}
    </React.Fragment>
  );
};
export default RolePage;

export const getServerSideProps = getServerSidePropsCustom<IRoleAndResources>(
  async ({ store, context }) => {
    const userLang = store.getState().app.userLang;
    const id = Number(context.params?.id);

    if (id) {
      const roleReq = await store.dispatch(rolesApi.endpoints.findOne.initiate(id));

      if (roleReq.data) {
        const resourcesReq = await store.dispatch(resourcesApi.endpoints.findAll.initiate());

        return {
          props: {
            meta: {
              title: `${lang.get(userLang)?.role}: ${roleReq.data.name}`,
              description: `${lang.get(userLang)?.role}: ${roleReq.data.name}`,
              h1: `${lang.get(userLang)?.role}: ${roleReq.data.name}`,
            },
            content: {
              role: roleReq.data,
              resources: resourcesReq.data || [],
            },
          },
        };

      }

    }

    return { notFound: true };
  }
);
