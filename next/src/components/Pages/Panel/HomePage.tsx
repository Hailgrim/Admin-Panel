'use client';

import { FC } from 'react';

import { IClientPage } from '@/lib/types';
import PanelPage from '../PanelPage';

const HomePage: FC<IClientPage> = ({ h1 }) => {
  return <PanelPage h1={h1}></PanelPage>;
};
export default HomePage;
