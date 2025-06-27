import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token) setIsLogged(true);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login: () => setIsLogged(true),
        logout: () => setIsLogged(false),
        isLogged
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
