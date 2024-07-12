'use server';

import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import usersService from '@/shared/api/users/usersService';
import rolesService from '@/shared/api/roles/rolesService';
import UserPage from '@/views/Panel/Users/UserPage';
import { getT } from '@/shared/locales/utils';
import { IServerPage } from '@/views/types';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.user,
    description: t.user,
  };
};

const User: FC<IServerPage> = async ({ params }) => {
  const t = getT();
  const id = Number(params.id);
  const user = await usersService.findOne(id);
  const roles = await rolesService.findAll();

  if (!user.data) {
    return notFound();
  }

  return <UserPage h1={t.user} data={{ user: user.data, roles: roles.data }} />;
};
export default User;
