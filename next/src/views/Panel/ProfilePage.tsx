'use client';

import { FC, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import PanelPage from '../PanelPage';
import UpdateProfileForm from '@/entities/Forms/Auth/UpdateProfileForm';
import { IClientPage } from '../types';
import useT from '@/shared/hooks/useT';
import authApi from '@/shared/api/auth/authApi';
import SessionForm from '@/entities/Forms/Auth/SessionForm';
import { makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';
import { useAppDispatch } from '@/shared/store/hooks';
import useLang from '@/shared/hooks/useLang';
import { ISession } from '@/shared/api/auth/types';

const ProfilePage: FC<IClientPage> = ({ h1 }) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const lang = useLang();
  const { data, isLoading, error } = authApi.useGetSessionsQuery();
  const [sessions, setSessions] = useState<ISession[]>();

  useEffect(() => {
    setSessions(
      data &&
        Array.from(data).sort((a, b) => (!a.current && b.current ? 1 : -1))
    );
  }, [data]);

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

  return (
    <PanelPage h1={h1}>
      <UpdateProfileForm />
      <Typography component="h2" variant="h6" sx={{ my: 1 }}>
        {t.sessions}
      </Typography>
      {isLoading && (
        <Skeleton variant="rounded" width="100%" height={56} sx={{ mb: 1 }} />
      )}
      {sessions?.map((session) => (
        <SessionForm
          key={session.id}
          session={session}
          onDelete={() =>
            setSessions(sessions.filter((item) => item.id !== session.id))
          }
        />
      ))}
    </PanelPage>
  );
};
export default ProfilePage;
