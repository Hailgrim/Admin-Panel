import React from 'react';
import { Box, Typography } from '@mui/material';

import lang from '../libs/lang';
import PageMeta from '../components/Other/PageMeta';
import { useAppSelector } from '../store/hooks';

const Error404Page: React.FC = () => {
  const userLang = useAppSelector(store => store.app.userLang);

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
        title={lang.get(userLang)?.error404}
        description={lang.get(userLang)?.pageNotFound}
        h1={lang.get(userLang)?.error404}
      />
      <Typography
        component="h2"
        variant="body1"
      >
        {lang.get(userLang)?.pageNotFound}
      </Typography>
    </Box>
  );
};
export default Error404Page;
