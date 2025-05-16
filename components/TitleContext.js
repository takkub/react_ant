'use client';

import React, { createContext, useContext, useState } from 'react';

const TitleContext = createContext({
  title: {
      title: '',
      icon: null,
  },
  setTitle: () => {},
});

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState({});
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};



export const useTitle = () => useContext(TitleContext);
