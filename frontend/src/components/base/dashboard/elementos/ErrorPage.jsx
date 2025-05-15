import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage({ errorCode = 404, errorMessage = "Página no encontrada" }) {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Error {errorCode}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {errorMessage}
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Ir a inicio
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};