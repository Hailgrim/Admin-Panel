import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import lang from '../../lib/lang';
import resourcesApi from '../../store/api/resourcesApi';
import { getServerSidePropsCustom, makePagination } from '../../lib/functions';
import { IFindAndCountRes, IPage, IResource } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import ResourcesTable from '../../components/Tables/ResourcesTable';

const ResourcesPage: React.FC<IPage<IFindAndCountRes<IResource>>> = ({ meta, pagination, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      <ResourcesTable data={content} pagination={pagination} />
    </React.Fragment>
  );
};
export default ResourcesPage;

export const getServerSideProps = getServerSidePropsCustom<IFindAndCountRes<IResource>>(
  async ({ store, context }) => {
    const userLang = store.getState().app.userLang;
    const pagination = makePagination(context.query);
    const { data, error } = await store
      .dispatch(resourcesApi.endpoints.findAndCountAll.initiate(pagination));

    if (error && (error as FetchBaseQueryError).status == 403) {
      return { notFound: true };
    }

    return {
      props: {
        meta: {
          title: lang.get(userLang)?.resources,
          description: lang.get(userLang)?.resources,
          h1: lang.get(userLang)?.resources,
        },
        pagination: pagination,
        content: data || null,
      },
    };
  }
);
