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

export const useTitleContext = (data) => {
    const { setTitle } = useTitle();
    useEffect(() => {
        setTitle({
            title: data.title,
            icon: data.icon,
        });
    }, [setTitle]);
}

export const useTitle = () => useContext(TitleContext);
