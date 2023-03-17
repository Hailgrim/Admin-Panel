import React from 'react';
import { Typography } from '@mui/material';
import Head from 'next/head';

import { IMeta } from '../../libs/types';

const PageMeta: React.FC<IMeta> = ({ title, description, h1 }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      {h1 && (
        <Typography
          component="h1"
          variant="h5"
          sx={{ py: 1.5, lineHeight: 1 }}
        >
          {h1}
        </Typography>
      )}
    </React.Fragment>
  );
};
export default PageMeta;
