import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SafeAreaContextProps {
  useSafeArea: boolean;
  setUseSafeArea: (value: boolean) => void;
}

const SafeAreaContext = createContext<SafeAreaContextProps>({
  useSafeArea: true,
  setUseSafeArea: () => {}
});

interface SafeAreaProviderProps {
  children: ReactNode;
}

export const SafeAreaProvider: React.FC<SafeAreaProviderProps> = ({ children }) => {
  const [useSafeArea, setUseSafeArea] = useState<boolean>(true);

  return (
    <SafeAreaContext.Provider value={{ useSafeArea, setUseSafeArea }}>
      {children}
    </SafeAreaContext.Provider>
  );
};

export const useSafeAreaConfig = () => useContext(SafeAreaContext); 