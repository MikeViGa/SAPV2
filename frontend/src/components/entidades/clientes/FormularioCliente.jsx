import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { actualizarClienteApi, crearClienteApi, } from '../../api/ClienteApiService';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cargando from '../../base/dashboard/elementos/Cargando';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import Grid from '@mui/material/Grid2';
import { Divider } from '@mui/material';
import { Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

export default function FormularioCliente({ modo, registro, open, onClose, refrescar }) {

    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("America/Mexico_City");

    const initialValues = {
        id: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        calle: '',
        numeroInterior: '',
        numeroExterior: '',
        colonia: '',
        ciudad: '',
        estado: '',
        codigoPostal: '',
        telefono1: '',
        telefono2: '',
        rfc: '',
        fechaRegistro: '',
    };

    const validationSchema = Yup.object({
        nombre: Yup.string().required('Requerido'),
        apellidoPaterno: Yup.string().required('Requerido'),
        apellidoMaterno: Yup.string().required('Requerido'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setLoading(true);
                let formData = {
                    id: values.id,
                    nombre: values.nombre,
                    apellidoPaterno: values.apellidoPaterno,
                    apellidoMaterno: values.apellidoMaterno,
                    calle: values.calle,
                    numeroInterior: values.numeroInterior,
                    numeroExterior: values.numeroExterior,
                    colonia: values.colonia,
                    ciudad: values.ciudad,
                    estado: values.estado,
                    codigoPostal: values.codigoPostal,
                    telefono1: values.telefono1,
                    telefono2: values.telefono2,
                    rfc: values.rfc,
                    fechaRegistro:values.fechaRegistro,
                };

                const response = (modo === "editar" ? actualizarClienteApi(formData.id, formData) : crearClienteApi(formData))
                    .then(response => {
                        addSnackbar("Registro " + (modo === "editar" ? "actualizado" : "creado") + " correctamente", "success");
                        setOperacionTerminada(true);
                    }).catch(error => {
                        if (error.response) {
                            addSnackbar(error.response.data, "error");
                        } else if (error.request) {
                            addSnackbar("Error en la petición: " + error.request.data, "error");
                        } else {
                            addSnackbar("Error inesperado al realizar la operación: " + error.message, "error");
                        }
                    });
            } catch (err) {
                console.log(`Error inesperado ${values.id ? ' actualizando' : ' creando'} cliente: ${err.message}`, "error");
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (open) {
            if (modo === "editar" && registro) {
                formik.setValues({
                    ...registro,
                    fechaRegistro: dayjs(registro.fechaRegistro),
                });
            } else {
                formik.resetForm({
                    values: initialValues,
                });
            }
        }
    }, [registro, modo, open]);

    const handleReset = () => {
        formik.resetForm({
            values: initialValues,
        });
    };

    const redAsteriskStyle = {
        '& .MuiInputLabel-asterisk': {
            color: 'red',
        },
    };

    const apellidoPaternoRef = useRef();
    const apellidoMaternoRef = useRef();
    const calleRef = useRef();
    const ciudadRef = useRef();
    const codigoPostalRef = useRef();
    const coloniaRef = useRef();
    const estadoRef = useRef();
    const fechaRegistroRef = useRef();
    const numeroInteriorRef = useRef();
    const numeroExteriorRef = useRef();
    const rfcRef = useRef();
    const telefono1Ref = useRef();
    const telefono2Ref = useRef();

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus(); // Focus the next input if it exists
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="lg" >
            <DialogContent>
                {loading ? (
                    <Cargando loading={loading} />
                ) : (
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '950px', margin: 'auto', mt: 0 }}
                    >
                        <Typography variant="h5" component="h1" gutterBottom>
                            {modo === 'editar' ? 'Editar cliente' : 'Crear cliente'}
                        </Typography>

                        <Typography >Datos personales:</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid xs={12} sm={6} md={3}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="nombre"
                                    name="nombre"
                                    label="Nombre"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                    helperText={formik.touched.nombre && formik.errors.nombre}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={apellidoPaternoRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="apellidoPaterno"
                                    name="apellidoPaterno"
                                    label="Apellido paterno"
                                    value={formik.values.apellidoPaterno}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.apellidoPaterno && Boolean(formik.errors.apellidoPaterno)}
                                    helperText={formik.touched.apellidoPaterno && formik.errors.apellidoPaterno}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={apellidoMaternoRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="apellidoMaterno"
                                    name="apellidoMaterno"
                                    label="Apellido Materno"
                                    value={formik.values.apellidoMaterno}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.apellidoMaterno && Boolean(formik.errors.apellidoMaterno)}
                                    helperText={formik.touched.apellidoMaterno && formik.errors.apellidoMaterno}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={calleRef}
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography > Domicilio: </Typography>
                        <Grid container spacing={2}>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="calle"
                                    name="calle"
                                    label="Calle"
                                    value={formik.values.calle}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.calle && Boolean(formik.errors.calle)}
                                    helperText={formik.touched.calle && formik.errors.calle}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={numeroInteriorRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="numeroInterior"
                                    name="numeroInterior"
                                    label="Número interior"
                                    value={formik.values.numeroInterior}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.numeroInterior && Boolean(formik.errors.numeroInterior)}
                                    helperText={formik.touched.numeroInterior && formik.errors.numeroInterior}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={numeroExteriorRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="numeroExterior"
                                    name="numeroExterior"
                                    label="Número exterior"
                                    value={formik.values.numeroExterior}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.numeroExterior && Boolean(formik.errors.numeroExterior)}
                                    helperText={formik.touched.numeroExterior && formik.errors.numeroExterior}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={coloniaRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="colonia"
                                    name="colonia"
                                    label="Colonia"
                                    value={formik.values.colonia}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.colonia && Boolean(formik.errors.colonia)}
                                    helperText={formik.touched.colonia && formik.errors.colonia}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={ciudadRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="ciudad"
                                    name="ciudad"
                                    label="Ciudad"
                                    value={formik.values.ciudad}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                                    helperText={formik.touched.ciudad && formik.errors.ciudad}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={estadoRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="estado"
                                    name="estado"
                                    label="Estado"
                                    value={formik.values.estado}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.estado && Boolean(formik.errors.estado)}
                                    helperText={formik.touched.estado && formik.errors.estado}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={codigoPostalRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="codigoPostal"
                                    name="codigoPostal"
                                    label="Código postal"
                                    value={formik.values.codigoPostal}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.codigoPostal && Boolean(formik.errors.codigoPostal)}
                                    helperText={formik.touched.codigoPostal && formik.errors.codigoPostal}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={telefono1Ref}
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography > Otros datos: </Typography>
                        <Grid container spacing={2}>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="telefono1"
                                    name="telefono1"
                                    label="Télefono 1"
                                    value={formik.values.telefono1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.telefono1 && Boolean(formik.errors.telefono1)}
                                    helperText={formik.touched.telefono1 && formik.errors.telefono1}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={telefono2Ref}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="telefono2"
                                    name="telefono2"
                                    label="Télefono 2"
                                    value={formik.values.telefono2}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.telefono2 && Boolean(formik.errors.telefono2)}
                                    helperText={formik.touched.telefono2 && formik.errors.telefono2}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={rfcRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="rfc"
                                    name="rfc"
                                    label="RFC"
                                    value={formik.values.rfc}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.rfc && Boolean(formik.errors.rfc)}
                                    helperText={formik.touched.rfc && formik.errors.rfc}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                    inputRef={fechaRegistroRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <DateTimePicker
                                        id="fechaRegistro"
                                        name="fechaRegistro"
                                        label="Fecha de registro"
                                        required
                                        value={formik.values.fechaRegistro}
                                        onChange={(newValue) => {
                                            const utcValue = newValue.utc();
                                            formik.setFieldValue('fechaRegistro', newValue)
                                        }}
                                        format="DD/MM/YYYY HH:mm:ss"
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                        }}
                                        slotProps={{
                                            textField: {
                                                name: "fechaRegistro",
                                                onBlur: formik.handleBlur,
                                                error: formik.touched.fechaRegistro && Boolean(formik.errors.fechaRegistro),
                                                helperText: formik.touched.fechaRegistro && formik.errors.fechaRegistro,
                                                size: "small",
                                                InputLabelProps: {
                                                    sx: redAsteriskStyle,
                                                    shrink: true,
                                                },
                                                onKeyDown: (e) => handleKeyDown(e, estadoRef),
                                                inputRef: fechaRegistroRef,
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Stack direction="row" spacing={1}>
                            <Button color="primary" startIcon={<SaveIcon />} variant="contained" type="submit" disabled={formik.isSubmitting}>
                                {formik.values.id ? 'Actualizar' : 'Agregar'}
                            </Button>
                            <Button color="primary" startIcon={<RefreshIcon />} variant="contained" onClick={handleReset} disabled={formik.isSubmitting}>Reiniciar</Button>
                            <Button color={operacionTerminada ? "primary" : "warning"}
                                variant="contained"
                                startIcon={operacionTerminada ? <ExitToAppIcon /> : <CancelIcon />}
                                onClick={onClose}
                                className="btn btn-warning" >
                                {operacionTerminada ? "Salir" : "Cancelar"}
                            </Button>
                        </Stack>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
};