import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import usersApi from '../../store/api/usersApi';
import { getServerSidePropsCustom, makePagination } from '../../lib/functions';
import { IFindAndCountRes, IPage, IUser } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import UsersTable from '../../components/Tables/UsersTable';

const UsersPage: React.FC<IPage<IFindAndCountRes<IUser>>> = ({ meta, pagination, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <UsersTable data={content} pagination={pagination} />
    </React.Fragment>
  );
};
export default UsersPage;

export const getServerSideProps = getServerSidePropsCustom<IFindAndCountRes<IUser>>(
  async ({ store, context }) => {
    const t = store.getState().app.t;
    const pagination = makePagination(context.query);
    const { data, error } = await store
      .dispatch(usersApi.endpoints.findAndCountAll.initiate(pagination));

    if (error && (error as FetchBaseQueryError).status == 403) {
      return { notFound: true };
    }

    return {
      props: {
        meta: {
          title: t.users,
          description: t.users,
          h1: t.users,
        },
        pagination: pagination,
        content: data || null,
      },
    };
  }
);
