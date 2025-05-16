'use client';
import React, {createContext, useContext, useEffect, useState} from 'react';
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

// Original hook for manual setting
export const useTitle = () => useContext(TitleContext);

// New simplified hook that handles title setting automatically
export const useTitleContext = (titleConfig) => {
  const context = useContext(TitleContext);
  
  useEffect(() => {
    if (titleConfig && context.setTitle) {
      context.setTitle(titleConfig);
    }
  }, []);
  
  return context;
};
