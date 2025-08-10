import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { actualizarRolApi, crearRolApi, } from "../../api/RolApiService"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, } from '@mui/material';
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
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                {loading ? (
                    <Cargando loading={loading} />
                ) : (
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 400, pt: 1 }}
                    >
                        <Typography variant="h5" gutterBottom>
                            {modo === 'editar' ? 'Editar rol' : 'Crear rol'}
                        </Typography>

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
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}