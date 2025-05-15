import React, { createContext, useContext, useState, useCallback } from 'react';

const SnackbarContext = createContext({
  snackbars: [],
  addSnackbar: () => { },
  removeSnackbar: () => { },
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);
  const addSnackbar = useCallback((message, severity = 'info', duration = 4000) => {
    setSnackbars(prev => [...prev, { id: Date.now(), message, severity, duration }]);
  }, []);

  const removeSnackbar = useCallback((id) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ snackbars, addSnackbar, removeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};