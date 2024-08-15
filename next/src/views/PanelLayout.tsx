import { FC, PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

import { IPage } from '@/views/types';

const PanelLayout: FC<IPage & PropsWithChildren> = ({ h1, children }) => {
  return (
    <>
      <Typography component="h1" variant="h5" sx={{ my: 1 }}>
        {h1}
      </Typography>
      {children}
    </>
  );
};
export default PanelLayout;
