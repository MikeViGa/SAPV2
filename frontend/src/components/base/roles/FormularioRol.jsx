import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Paper, Stack } from '@mui/material';
import { actualizarRolApi, crearRolApi, } from "../../api/RolApiService"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDraggableDialog } from '../common/useDraggableDialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cargando from '../dashboard/elementos/Cargando';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { useSnackbar } from '../dashboard/elementos/SnackbarContext';

export default function FormularioRol({ modo, registro, open, onClose, refrescar }) {
    const { addSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open);

    const formik = useFormik({
        initialValues: {
            id: '',
            nombre: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('Requerido'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const apiCall = modo === "editar"
                    ? actualizarRolApi(values.id, values)
                    : crearRolApi(values);

                await apiCall;
                addSnackbar(`Rol ${modo === "editar" ? "actualizado" : "creado"} correctamente`, "success");
                refrescar?.();
                onClose();
            } catch (error) {
                const message = error.response?.data || error.message || "Error inesperado";
                addSnackbar(message, "error");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (open) {
            if (modo === "editar" && registro) {
                formik.setValues(registro);
            } else {
                formik.resetForm();
            }
        }
    }, [open, modo, registro]);

    const handleReset = () => {
        formik.resetForm();
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={dialogPaperProps}>
            <DialogTitle {...dialogTitleProps} sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2, cursor: 'move' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        {modo === 'editar' ? 'Editar rol' : 'Crear rol'}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close" sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Cargando loading={loading} />
                ) : (
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 450, pt: 1 }}
                    >
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
                            <TextField
                                size="small"
                                required
                                fullWidth
                                name="nombre"
                                label="Nombre"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                helperText={formik.touched.nombre && formik.errors.nombre}
                                autoFocus
                            />
                        </Paper>
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    startIcon={<SaveIcon />}
                                    fullWidth
                                >
                                    {modo === 'editar' ? 'Actualizar' : 'Agregar'}
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={handleReset}
                                    disabled={formik.isSubmitting}
                                    startIcon={<RefreshIcon />}
                                    fullWidth
                                >
                                    Reiniciar
                                </Button>

                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={onClose}
                                    startIcon={<CancelIcon />}
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Paper>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}