import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbar } from './SnackbarContext';

export default function MultipleSnackbars(){
  const { snackbars, removeSnackbar } = useSnackbar();
  if (!snackbars || !Array.isArray(snackbars)) {
    console.error('Snackbars is not an array:', snackbars);
    return null; // or return some fallback UI
  }

  return (
    <>
      {snackbars.map((snackbar, index) => (
        <Snackbar
          key={snackbar.id}
          open={true}
          autoHideDuration={snackbar.duration}
          onClose={() => removeSnackbar(snackbar.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          style={{ bottom: `${index * 60 + 16}px` }}
        >
          <Alert 
            onClose={() => removeSnackbar(snackbar.id)} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};