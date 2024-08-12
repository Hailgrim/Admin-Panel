'use client';

import { FC } from 'react';

import PanelLayout from '../PanelLayout';
import { IClientPage } from '../types';

const HomePage: FC<IClientPage> = ({ h1 }) => {
  return <PanelLayout h1={h1}></PanelLayout>;
};
export default HomePage;
