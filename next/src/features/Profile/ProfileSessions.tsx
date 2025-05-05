'use client';

import { FC, useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

import SessionForm from '@/features/Profile/SessionForm';
import { makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';
import { useAppDispatch } from '@/shared/store/hooks';
import useLang from '@/shared/hooks/useLang';
import profileApi from '@/shared/api/profile/profileApi';
import { IExternalSession } from '@/shared/api/profile/types';

const ProfileSessions: FC = () => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const { data, isLoading, error } = profileApi.useGetSessionsQuery();
  const [sessions, setSessions] = useState<IExternalSession[]>();

  useEffect(() => {
    setSessions(
      data && data.sort((a, b) => (!a.current && b.current ? 1 : -1))
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
    <>
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
    </>
  );
};
export default ProfileSessions;
