import { FC, PropsWithChildren } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import theme from '@/shared/lib/theme';
import { IClientPage } from './types';

const AuthPage: FC<IClientPage & PropsWithChildren> = ({ h1, children }) => {
  return (
    <AuthContainerStyled maxWidth="xs">
      <Box component="header">
        <Typography component="h1" variant="h5" align="center" sx={{ my: 1 }}>
          {h1}
        </Typography>
      </Box>
      <Box component="main">{children}</Box>
    </AuthContainerStyled>
  );
};
export default AuthPage;

const AuthContainerStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding-block: ${theme.spacing(1)};
`;
