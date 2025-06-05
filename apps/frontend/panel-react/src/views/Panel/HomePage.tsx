'use client';

import { FC } from 'react';

import PanelLayout from '../PanelLayout';
import { IPage } from '../types';

const HomePage: FC<IPage> = ({ h1 }) => {
  return <PanelLayout h1={h1}></PanelLayout>;
};
export default HomePage;
