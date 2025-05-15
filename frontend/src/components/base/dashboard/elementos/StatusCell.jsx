import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';

export default function StatusCell(props) {

    const getChipProps = (estado) => {
        if (estado == null) {
            return { label: 'Unknown', color: 'default' };
        }
        const lowercaseStatus = estado.toString().toLowerCase();
        switch (lowercaseStatus) {
            case 'activo':
                return { label: estado, color: 'success', icon: <CheckCircleIcon /> };
            case 'pending':
                return { label: estado, color: 'warning', icon: <HourglassEmptyIcon /> };
            case 'disabled':
            case 'cancelado':
                return { label: estado, color: 'default', icon: <BlockIcon />, sx: { backgroundColor: 'grey.400' } };
            default:
                return { label: estado, color: 'default', icon: <ErrorIcon /> };
        }
    };
    const chipProps = getChipProps(props.value);
    return <Chip size="small" {...chipProps} />;
};