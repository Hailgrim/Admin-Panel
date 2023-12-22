import { Alert, Fade, Snackbar } from '@mui/material';
import React from 'react';

import theme from '../../lib/theme';
import { IAlert } from '../../lib/types';
import { useAppDispatch } from '../../store/hooks';
import { deleteAlert } from '../../store/slices/appSlice';
import useT from 'hooks/useT';

interface IAlertItem {
  data: IAlert;
  callback?: () => void;
}

const AlertItem = React.forwardRef<unknown, IAlertItem>(
  ({ data, callback }, ref) => {
    const dispatch = useAppDispatch();
    const t = useT();
    const [visibility, setVisibility] = React.useState(true);
    const [callbackTimeout, setCallbackTimeout] =
      React.useState<NodeJS.Timeout>();

    const closeHandler = (id: number, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setVisibility(false);
      dispatch(deleteAlert(id));
      setCallbackTimeout(
        setTimeout(() => {
          if (callback) {
            callback();
          }
        }, 1000)
      );
    };

    React.useEffect(() => {
      return () => {
        if (callbackTimeout) {
          clearTimeout(callbackTimeout);
        }
      };
    }, [callbackTimeout]);

    return (
      <Snackbar
        open={visibility}
        autoHideDuration={6000}
        onClose={(_, reason) => closeHandler(data.id, reason)}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ref={ref}
        sx={{
          position: 'relative',
          marginTop: theme.spacing(1.5),
          marginBottom: theme.spacing(1.5),
          marginLeft: theme.spacing(3),
          marginRight: theme.spacing(3),
          left: 'unset !important',
          right: 'unset !important',
          bottom: 'unset !important',
          whiteSpace: 'break-spaces',
        }}
      >
        <Alert
          severity={data.type}
          variant="filled"
          sx={{ width: '100%', margin: 0 }}
          onClose={() => closeHandler(data.id)}
        >
          {data.text
            ? data.text
            : data.type == 'success'
            ? t.success
            : t.failure}
        </Alert>
      </Snackbar>
    );
  }
);
AlertItem.displayName = 'AlertItem';
export default AlertItem;
