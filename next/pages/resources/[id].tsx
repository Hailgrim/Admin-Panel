import React from 'react';

import lang from '../../lib/lang';
import resourcesApi from '../../store/api/resourcesApi';
import { getServerSidePropsCustom } from '../../lib/functions';
import { IPage, IResource } from '../../lib/types';
import PageMeta from '../../components/Other/PageMeta';
import UpdateResource from '../../components/Forms/Resource/UpdateResource';

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
    const userLang = store.getState().app.userLang;
    const id = Number(context.params?.id);

    if (id) {
      const { data } = await store.dispatch(resourcesApi.endpoints.findOne.initiate(id));
      if (data) {
        return {
          props: {
            meta: {
              title: `${lang.get(userLang)?.resource}: ${data.name}`,
              description: `${lang.get(userLang)?.resource}: ${data.name}`,
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
