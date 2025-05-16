import React, { createContext, useContext, useState } from 'react';

const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('');

  const openDrawer = ({ title = '', content = null }) => {
    setContent(content);
    setIsOpen(true);
    setTitle(title);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setContent(null);
    setTitle('');
  };

  const toggleDrawer = () => setIsOpen(prev => !prev);

  return (
    <DrawerContext.Provider value={{ isOpen, content, title, openDrawer, closeDrawer, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer must be used within a DrawerProvider');
  return context;
};
