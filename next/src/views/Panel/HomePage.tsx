'use client';

import { FC } from 'react';

import PanelPage from '../PanelPage';
import { IClientPage } from '../types';

const HomePage: FC<IClientPage> = ({ h1 }) => {
  return <PanelPage h1={h1}></PanelPage>;
};
export default HomePage;
