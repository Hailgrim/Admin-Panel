import { Box } from '@mui/system';
import React from 'react';

import { IAlert } from '../../lib/types';
import { useAppSelector } from '../../store/hooks';
import AlertItem from './AlertItem';
import theme from '../../lib/theme';

const Alerts: React.FC = () => {
  const alerts = useAppSelector(store => store.app.alerts);
  const [activeAlerts, setActiveAlerts] = React.useState<Map<number, IAlert>>(new Map());
  const alertsRoot = React.createRef<HTMLDivElement>();

  const closeHandler = (id: number) => {
    setActiveAlerts(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  React.useEffect(() => {
    setActiveAlerts(prev => {
      const next = new Map(prev);
      alerts.forEach(alert => {
        if (!next.has(alert.id)) {
          next.set(alert.id, alert);
        }
      });
      return next;
    });
  }, [alerts]);

  return (
    <Box
      component="div"
      ref={alertsRoot}
      sx={{
        position: 'fixed',
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column-reverse',
        justifyContent: 'end',
        alignItems: 'end',
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
      }}
    >
      {Array.from(activeAlerts.values()).reverse().map(alert => (
        <AlertItem
          key={`alert.${alert.id}`}
          data={alert}
          callback={() => closeHandler(alert.id)}
          ref={alertsRoot}
        />
      ))}
    </Box>
  );
};
export default Alerts;
