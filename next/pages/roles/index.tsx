import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import rolesApi from '../../store/api/rolesApi';
import { getServerSidePropsCustom, makePagination } from '../../lib/functions';
import { IFindAndCountRes, IPage, IRole } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import RoleTable from '../../components/Tables/RolesTable';

const RolesPage: React.FC<IPage<IFindAndCountRes<IRole>>> = ({ meta, pagination, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <RoleTable data={content} pagination={pagination} />
    </React.Fragment>
  );
};
export default RolesPage;

export const getServerSideProps = getServerSidePropsCustom<IFindAndCountRes<IRole>>(
  async ({ store, context }) => {
    const t = store.getState().app.t;
    const pagination = makePagination(context.query);
    const { data, error } = await store
      .dispatch(rolesApi.endpoints.findAndCountAll.initiate(pagination));

    if (error && (error as FetchBaseQueryError).status == 403) {
      return { notFound: true };
    }

    return {
      props: {
        meta: {
          title: t.roles,
          description: t.roles,
          h1: t.roles,
        },
        pagination: pagination,
        content: data || null,
      },
    };
  }
);
