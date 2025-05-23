'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelLayout from '../PanelLayout';
import UpdateProfileForm from '@/features/Profile/UpdateProfileForm';
import { IPage } from '../types';
import useTranslate from '@/shared/hooks/useTranslate';
import ProfileSessions from '@/features/Profile/ProfileSessions';
import ProfileRoles from '@/features/Profile/ProfileRoles';
import UpdatePasswordForm from '@/features/Profile/UpdatePasswordForm';
import ChangeEmailRequestForm from '@/features/Profile/ChangeEmailRequestForm';

const ProfilePage: FC<IPage> = ({ h1 }) => {
  const t = useTranslate();

  return (
    <PanelLayout h1={h1}>
      <UpdateProfileForm />
      <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
        {t.roles}
      </Typography>
      <ProfileRoles />
      <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
        {t.changeEmail}
      </Typography>
      <ChangeEmailRequestForm />
      <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
        {t.updatePassword}
      </Typography>
      <UpdatePasswordForm />
      <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
        {t.sessions}
      </Typography>
      <ProfileSessions />
    </PanelLayout>
  );
};
export default ProfilePage;
