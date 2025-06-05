import { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { IPage } from './types';

const AuthLayout: FC<IPage & PropsWithChildren> = ({ h1, children }) => {
  return (
    <>
      <Box component="header">
        <Typography component="h1" variant="h5" align="center" sx={{ my: 1 }}>
          {h1}
        </Typography>
      </Box>
      <Box component="main">{children}</Box>
    </>
  );
};
export default AuthLayout;
