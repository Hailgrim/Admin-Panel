'use server';

import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import getT from '@/hooks/getT';
import usersService from '@/services/usersService';
import rolesService from '@/services/rolesService';
import { IServerPage } from '@/lib/types';
import UserPage from '@/components/Pages/Panel/Users/UserPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.user,
    description: t.user,
  };
};

const User: FC<IServerPage> = async ({ params }) => {
  const t = await getT();
  const id = Number(params.id);
  const user = await usersService.findOne(id);
  const roles = await rolesService.findAll();

  if (!user.data) {
    return notFound();
  }

  return <UserPage h1={t.user} data={{ user: user.data, roles: roles.data }} />;
};
export default User;
