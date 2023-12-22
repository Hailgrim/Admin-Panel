import React from 'react';

import resourcesApi from '../../store/api/resourcesApi';
import { getServerSidePropsCustom } from '../../lib/functions';
import { IPage, IResource } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import UpdateResource from '../../components/Forms/Resource/UpdateResource';
import dictionary from 'locales/dictionary';

const UserPage: React.FC<IPage<IResource>> = ({ meta, content }) => {
  return (
    <React.Fragment>
      <PageMeta {...meta} />
      {content && <UpdateResource data={content} />}
    </React.Fragment>
  );
};
export default UserPage;

export const getServerSideProps = getServerSidePropsCustom<IResource>(
  async ({ store, context }) => {
    const t = dictionary[store.getState().app.language];
    const id = Number(context.params?.id);

    if (id) {
      const { data } = await store.dispatch(
        resourcesApi.endpoints.findOne.initiate(id)
      );
      if (data) {
        return {
          props: {
            meta: {
              title: `${t.resource}: ${data.name}`,
              description: `${t.resource}: ${data.name}`,
              h1: data.name,
            },
            content: data || null,
          },
        };
      }
    }

    return { notFound: true };
  }
);
