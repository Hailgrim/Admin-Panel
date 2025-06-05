'use client';

import { FC, useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

import SessionForm from '@/features/Profile/SessionForm';
import { addAlert } from '@/shared/store/main/main';
import { useAppDispatch } from '@/shared/store/hooks';
import profileApi from '@/shared/api/profile/profileApi';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import { getErrorText, TExternalSession } from '@ap/shared';

const ProfileSessions: FC = () => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const { data, isLoading, error } = profileApi.useGetSessionsQuery();
  const [sessions, setSessions] = useState<TExternalSession[]>();

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
          text: getErrorText(error, lRef.current),
        })
      );
    }
  }, [dispatch, error, lRef]);

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
