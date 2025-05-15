import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../imagenes/fondo.png'

export default function Escritorio() {
    return (
        <Box
            sx={{
                border: 0,
                width: '50%',
                height: '780px',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                padding: 0,
                opacity: 0.1,
                zIndex: -1,
            }}
        >
        </Box>
    );
}