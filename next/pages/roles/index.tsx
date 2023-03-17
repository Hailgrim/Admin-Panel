import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import lang from '../../libs/lang';
import rolesApi from '../../store/api/rolesApi';
import { getServerSidePropsCustom, makePagination } from '../../libs/functions';
import { IFindAndCountRes, IPage, IRole } from '../../libs/types';
import PageMeta from '../../components/Other/PageMeta';
import RoleTable from '../../components/Tables/RoleTable';

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
    const userLang = store.getState().app.userLang;
    const pagination = makePagination(context.query);
    const { data, error } = await store
      .dispatch(rolesApi.endpoints.findAndCountAll.initiate(pagination));

    if (error && (error as FetchBaseQueryError).status == 403) {
      return { notFound: true };
    }

    return {
      props: {
        meta: {
          title: lang.get(userLang)?.roles,
          description: lang.get(userLang)?.roles,
          h1: lang.get(userLang)?.roles,
        },
        pagination: pagination,
        content: data || null,
      },
    };
  }
);
