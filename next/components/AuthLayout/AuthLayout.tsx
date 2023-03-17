import { Box, Container } from '@mui/material';
import React from 'react';

import CustomHead from '../Other/CustomHead';

const AuthLayout: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <Container
      component="main"
      maxWidth={'xs'}
      sx={{ px: 3, py: 1.5 }}
    >
      <CustomHead />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};
export default AuthLayout;
