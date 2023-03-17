import React from 'react';

import Content from './Content';
import Header from './Header';
import SideBar from './SideBar';
import CustomHead from '../Other/CustomHead';
import Alerts from '../Other/Alerts';

const PanelLayout: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <React.Fragment>
      <SideBar />
      <CustomHead />
      <Header />
      <Content>
        {children}
      </Content>
      <Alerts />
    </React.Fragment>
  );
};
export default PanelLayout;
