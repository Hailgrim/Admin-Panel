import React from 'react';
import { Box, Typography } from '@mui/material';

import PageMeta from '../components/Other/PageMeta';
import useT from 'hooks/useT';

const Error404Page: React.FC = () => {
  const t = useT();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        width: '100%',
      }}
    >
      <PageMeta
        title={t.error404}
        description={t.pageNotFound}
        h1={t.error404}
      />
      <Typography component="h2" variant="body1">
        {t.pageNotFound}
      </Typography>
    </Box>
  );
};
export default Error404Page;
