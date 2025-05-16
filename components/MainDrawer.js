import React from 'react';
import { Drawer } from 'antd';
import { useDrawer } from '../store/context/DrawerContext';

const MainDrawer = () => {
  const { isOpen, content, title, closeDrawer } = useDrawer();

  return (
    <Drawer
      title={title}
      closable={true}
      onClose={closeDrawer}
      open={isOpen}
    >
      {content}
    </Drawer>
  );
};

export default MainDrawer;
