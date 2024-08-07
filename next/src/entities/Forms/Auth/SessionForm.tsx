import { FC, FormEvent, useEffect, useRef } from 'react';
import UAParser from 'ua-parser-js';
import DeleteIcon from '@mui/icons-material/Delete';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  styled,
  Typography,
} from '@mui/material';

import Form from '@/shared/kit/Form/Form';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import authApi from '@/shared/api/auth/authApi';
import { useAppDispatch } from '@/shared/store/hooks';
import { makeDateString, makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';
import { ISession } from '@/shared/api/auth/types';
import theme from '@/shared/lib/theme';
import { ROUTES } from '@/shared/lib/constants';
import useRights from '@/shared/hooks/useRights';

const SessionForm: FC<{ session: ISession; onDelete?: () => void }> = ({
  session,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const rights = useRights(ROUTES.api.auth.profile);
  const userAgent = useRef(new UAParser(session.userAgent).getResult());
  const [remove, { data, isLoading, error }] =
    authApi.useDeleteSessionsMutation();

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    remove([session.id]);
  };

  useEffect(() => {
    if (error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(error, lang.current),
        })
      );
    }
  }, [dispatch, error, lang]);

  useEffect(() => {
    if (data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
      onDelete?.();
    }
  }, [data, dispatch, lang, onDelete]);

  return (
    <Form onSubmit={formHandler}>
      <Session>
        <SessionContent>
          {userAgent.current.device.vendor ? (
            <>
              <SmartphoneIcon sx={{ mr: 1 }} />
              <Typography component="span" variant="body2">
                {userAgent.current.device.vendor}{' '}
                {userAgent.current.device.model}
                {','}&nbsp;
              </Typography>
            </>
          ) : (
            <>
              <ComputerIcon sx={{ mr: 1 }} />
              <Typography component="span" variant="body2">
                {userAgent.current.os.name} {userAgent.current.os.version}
                {','}&nbsp;
              </Typography>
            </>
          )}
          <Typography component="span" variant="body2">
            {userAgent.current.browser.name} {userAgent.current.browser.version}
            {','}&nbsp;
          </Typography>
          <Typography component="span" variant="body2" sx={{ opacity: 0.8 }}>
            {session.ip}
            {','}&nbsp;
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{ mr: 1, opacity: 0.6 }}
          >
            {makeDateString(session.updatedAt)}
          </Typography>
          {session.current && (
            <Chip
              label={t.current}
              color="success"
              variant="outlined"
              size="small"
            />
          )}
        </SessionContent>
        <CardActions sx={{ pr: 2 }}>
          <IconButton
            edge="end"
            color="error"
            aria-label="sign out"
            title={t.signOut}
            disabled={!rights.updating || isLoading || data}
            type="submit"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Session>
    </Form>
  );
};
export default SessionForm;

const Session = styled(Card)`
  display: flex;
  flex-direction: row;
  margin-bottom: ${theme.spacing(1)};
`;

const SessionContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;
