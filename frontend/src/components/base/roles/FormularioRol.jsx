import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Paper, Stack, Switch, FormControlLabel, Chip } from '@mui/material';
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
import { styled } from '@mui/material/styles';
import { useSnackbar } from '../dashboard/elementos/SnackbarContext';

export default function FormularioRol({ modo, registro, open, onClose, refrescar }) {
    const { addSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open);

    const formik = useFormik({
        initialValues: {
            id: '',
            nombre: '',
            activo: true,
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
                
                // Mensaje personalizado según el estado del rol
                let mensaje = `Rol ${modo === "editar" ? "actualizado" : "creado"} correctamente`;
                if (modo === "editar" && !values.activo) {
                    mensaje += " (Rol desactivado)";
                }
                
                addSnackbar(mensaje, "success");
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
                formik.setValues({
                    id: registro.id || '',
                    nombre: registro.nombre || '',
                    activo: registro.activo !== undefined ? registro.activo : true,
                });
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 500, pt: 1 }}
                    >
                        <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
                            <Stack direction="column" spacing={2}>
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

                                {/* Campo para activar/desactivar rol (soft delete) */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.activo}
                                                onChange={(e) => formik.setFieldValue('activo', e.target.checked)}
                                                name="activo"
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2">
                                                    Estado del rol
                                                </Typography>
                                                <Chip
                                                    label={formik.values.activo ? 'Activo' : 'Inactivo'}
                                                    color={formik.values.activo ? 'success' : 'error'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                    />
                                </Box>
                                {!formik.values.activo && (
                                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                                        ⚠️ Rol inactivo: Los usuarios con este rol no podrán utilizarlo
                                    </Typography>
                                )}
                            </Stack>
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