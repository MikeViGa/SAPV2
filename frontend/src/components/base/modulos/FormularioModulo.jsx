import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, } from '@mui/material';
import { actualizarModuloApi, crearModuloApi, obtenerModulosApi } from "../../api/ModuloApiService"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, Autocomplete, FormControlLabel, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import Cargando from '../../base/dashboard/elementos/Cargando';
import Switch from '@mui/material/Switch';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';

export default function FormularioModulo({ modo, registro, open, onClose, refrescar }) {
    const { addSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [superModulos, setSuperModulos] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const formik = useFormik({
        initialValues: {
            id: '',
            nombre: '',
            icono: '',
            orden: '',
            ruta: '',
            visible: true,
            superModulo: null,
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('Requerido')
                .max(100, 'Máximo 100 caracteres'),
            ruta: Yup.string()
                .required('Requerido')
                .max(100, 'Máximo 100 caracteres'),
            icono: Yup.string()
                .max(100, 'Máximo 100 caracteres'),
            orden: Yup.number()
                .required('Requerido')
                .positive('Debe ser un número positivo')
                .integer('Debe ser un número entero'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = {
                    id: values.id,
                    nombre: values.nombre,
                    icono: values.icono,
                    orden: parseInt(values.orden),
                    ruta: values.ruta,
                    visible: values.visible,
                    superModuloId: values.superModulo?.id || null, // Solo enviar el ID
                };

                const apiCall = modo === "editar"
                    ? actualizarModuloApi(formData.id, formData)
                    : crearModuloApi(formData);

                await apiCall;
                addSnackbar(`Módulo ${modo === "editar" ? "actualizado" : "creado"} correctamente`, "success");
                refrescar?.();
                onClose();
            } catch (error) {
                console.error('Error completo:', error); // Debug

                // Manejo correcto del error
                let message = "Error inesperado";

                if (error.response?.data) {
                    // Si es un objeto de error de Spring Boot
                    if (typeof error.response.data === 'object') {
                        message = error.response.data.message ||
                            error.response.data.error ||
                            `Error ${error.response.data.status || 'del servidor'}`;
                    } else {
                        // Si es un string directo
                        message = error.response.data;
                    }
                } else if (error.message) {
                    message = error.message;
                }

                addSnackbar(message, "error");
            } finally {
                setLoading(false);
            }
        },
    });

    const cargarDatosFormulario = async () => {
        setLoadingData(true);
        try {
            // Cargar todos los módulos
            const response = await obtenerModulosApi();
            const modulos = response.data || [];
            setSuperModulos(modulos);

            // Si es edición y hay un superModuloId, configurar el formulario
            if (modo === "editar" && registro) {
                const superModuloCompleto = registro.superModulo?.id
                    ? modulos.find(m => m.id === registro.superModulo.id)
                    : null;

                formik.setValues({
                    ...registro,
                    superModulo: superModuloCompleto || null,
                });
            } else {
                formik.resetForm();
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (open) {
            cargarDatosFormulario();
        }
    }, [open, modo, registro]);

    const handleReset = () => {
        formik.resetForm();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        {modo === 'editar' ? 'Editar módulo' : 'Crear módulo'}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close" sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {loading || loadingData ? (
                    <Cargando loading={loading || loadingData} />
                ) : (
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
                    >
                        <Typography variant="h5" gutterBottom>
                            {modo === 'editar' ? 'Editar módulo' : 'Crear módulo'}
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

                        <TextField
                            size="small"
                            required
                            fullWidth
                            name="ruta"
                            label="Ruta"
                            value={formik.values.ruta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ruta && Boolean(formik.errors.ruta)}
                            helperText={formik.touched.ruta && formik.errors.ruta}
                            placeholder="/ejemplo/ruta"
                        />

                        <TextField
                            size="small"
                            fullWidth
                            name="icono"
                            label="Icono"
                            value={formik.values.icono}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.icono && Boolean(formik.errors.icono)}
                            helperText={formik.touched.icono && formik.errors.icono}
                            placeholder="dashboard, settings, etc."
                        />

                        <TextField
                            size="small"
                            required
                            fullWidth
                            name="orden"
                            label="Orden"
                            type="number"
                            value={formik.values.orden}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.orden && Boolean(formik.errors.orden)}
                            helperText={formik.touched.orden && formik.errors.orden}
                        />

                        <Autocomplete
                            size="small"
                            options={superModulos}
                            getOptionLabel={(option) => option.nombre || ''}
                            value={formik.values.superModulo}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('superModulo', newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Supermódulo"
                                    placeholder="Seleccionar supermódulo (opcional)"
                                />
                            )}
                            isOptionEqualToValue={(option, value) => {
                                if (!option || !value) return option === value;
                                return option.id === value.id;
                            }}
                            noOptionsText="No hay supermódulos disponibles"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.visible}
                                    onChange={(event) => {
                                        formik.setFieldValue('visible', event.target.checked);
                                    }}
                                    name="visible"
                                />
                            }
                            label="Visible"
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
