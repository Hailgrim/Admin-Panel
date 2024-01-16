import Snackbar from '@mui/material/Snackbar';
import { FC, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import theme from '@/lib/theme';
import { deleteAlert } from '@/store/slices/appSlice';

const Alerts: FC = () => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.app.alerts);
  const alerts2 = useMemo(() => alerts, [alerts]);

  const closeHandler = (args: {
    id: number;
    delay?: boolean;
    reason?: string;
  }) => {
    if (args.reason === 'clickaway') {
      return;
    }

    dispatch(deleteAlert({ id: args.id, delay: args.delay }));
  };

  return (
    <AlertsContainer>
      {alerts2.map((alert) => (
        <Snackbar
          key={`alert:${alert.id}`}
          open={alert.deleted !== true}
          autoHideDuration={5000}
          sx={{ py: 1 }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={(_, reason) =>
            closeHandler({ id: alert.id, delay: true, reason })
          }
          onTransitionEnd={() =>
            alert.deleted && closeHandler({ id: alert.id })
          }
        >
          <Alert
            onClose={() => closeHandler({ id: alert.id, delay: true })}
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
export default Alerts;

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
