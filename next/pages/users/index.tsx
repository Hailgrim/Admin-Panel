import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import lang from '../../libs/lang';
import usersApi from '../../store/api/usersApi';
import { getServerSidePropsCustom, makePagination } from '../../libs/functions';
import { IFindAndCountRes, IPage, IUser } from '../../libs/types';
import PageMeta from '../../components/Other/PageMeta';
import UserTable from '../../components/Tables/UserTable';

const UsersPage: React.FC<IPage<IFindAndCountRes<IUser>>> = ({ meta, pagination, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <UserTable data={content} pagination={pagination} />
    </React.Fragment>
  );
};
export default UsersPage;

export const getServerSideProps = getServerSidePropsCustom<IFindAndCountRes<IUser>>(
  async ({ store, context }) => {
    const userLang = store.getState().app.userLang;
    const pagination = makePagination(context.query);
    const { data, error } = await store
      .dispatch(usersApi.endpoints.findAndCountAll.initiate(pagination));

    if (error && (error as FetchBaseQueryError).status == 403) {
      return { notFound: true };
    }

    return {
      props: {
        meta: {
          title: lang.get(userLang)?.users,
          description: lang.get(userLang)?.users,
          h1: lang.get(userLang)?.users,
        },
        pagination: pagination,
        content: data || null,
      },
    };
  }
);
