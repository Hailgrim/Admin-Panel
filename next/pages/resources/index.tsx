import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

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
    const t = store.getState().app.t;
    const pagination = makePagination(context.query);
    const { data, error } = await store
      .dispatch(resourcesApi.endpoints.findAndCountAll.initiate(pagination));

    if (error && (error as FetchBaseQueryError).status == 403) {
      return { notFound: true };
    }

    return {
      props: {
        meta: {
          title: t.resources,
          description: t.resources,
          h1: t.resources,
        },
        pagination: pagination,
        content: data || null,
      },
    };
  }
);
