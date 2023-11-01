import { styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import theme from '../../libs/theme';

const DataGridStyled = styled(DataGrid)(() => ({

  maxHeight: '100vh',
  minHeight: '50vh',
  width: '100%',
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),

}));
export default DataGridStyled;
