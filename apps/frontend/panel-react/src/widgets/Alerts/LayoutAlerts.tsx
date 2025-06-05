import Snackbar from '@mui/material/Snackbar';
import { FC } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import theme from '@/shared/lib/theme';
import { deleteAlert } from '@/shared/store/main/main';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';

const LayoutAlerts: FC = () => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.main.alerts);

  const closeHandler = (id: number, delay?: boolean, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(deleteAlert({ id, delay }));
  };

  return (
    <AlertsContainer>
      {alerts.map((alert) => (
        <Snackbar
          key={`alert:${alert.id}`}
          open={alert.deleted !== true}
          autoHideDuration={5000}
          sx={{ py: 1 }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={(_, reason) => closeHandler(alert.id, true, reason)}
          onTransitionEnd={() => alert.deleted && closeHandler(alert.id)}
        >
          <Alert
            onClose={() => closeHandler(alert.id, true)}
            severity={alert.type}
            variant="filled"
            sx={{ whiteSpace: 'break-spaces' }}
          >
            {alert.text}
          </Alert>
        </Snackbar>
      ))}
    </AlertsContainer>
  );
};
export default LayoutAlerts;

const AlertsContainer = styled(Box)`
  position: fixed;
  bottom: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  padding-inline: ${theme.spacing(2)};
  padding-block: ${theme.spacing(1)};
  & > .MuiSnackbar-root {
    position: relative;
    bottom: auto;
    right: auto;
    left: auto;
    width: 100%;
    & > .MuiPaper-root {
      width: 100%;
    }
  }
`;
