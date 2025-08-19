import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { actualizarVendedorApi, crearVendedorApi, } from '../../api/VendedorApiService';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDraggableDialog } from '../../base/common/useDraggableDialog';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cargando from '../../base/dashboard/elementos/Cargando';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { styled } from '@mui/material/styles';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { Divider } from '@mui/material';
import { Stack } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { obtenerSupervisoresApi } from '../../api/SupervisorApiService';
import { List, ListItem, ListItemText, IconButton, } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { obtenerVendedoresApi, obtenerSupervisadosPorVendedorApi } from '../../api/VendedorApiService';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function FormularioVendedor({ modo, registro, open, onClose, refrescar }) {

    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);

    const [supervisores, setSupervisores] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [supervisados, setSupervisados] = useState([]);

    const [supervisorSeleccionado, setSupervisorSeleccionado] = useState(null);
    const [supervisadoSeleccionado, setSupervisadoSeleccionado] = useState(null);

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("America/Mexico_City");

    const cargarVendedores = () => {
        return obtenerVendedoresApi()
            .then(respuesta => {
                setVendedores(respuesta.data);
            }).catch(error => {
                console.log(error);
            });
    };

    const cargarSupervisores = () => {
        obtenerSupervisoresApi()
            .then(response => {
                setSupervisores(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }

    const cargarSupervisados = (idVendedor) => {
        obtenerSupervisadosPorVendedorApi(idVendedor)
            .then(response => {
                setSupervisados(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }

    useEffect(() => {
        if (open) {
            console.log("MODOOOOOOOOOO: "+ modo);
            cargarSupervisores();
            cargarVendedores();
            if (modo === "editar" && registro) {
                formik.setValues({
                    ...registro,
                    fechaAlta: dayjs(registro.fechaAlta, "DD/MM/YYYY HH:mm:ss"),
                });
                cargarSupervisados(registro.id);
            } else {
                setSupervisorSeleccionado();
                formik.resetForm({
                    values: initialValues,
                });
            }
        }
    }, [registro, modo, open]);

    const addItem = () => {
        if (supervisadoSeleccionado) {
            const exists = supervisados.some(item => item.id === supervisadoSeleccionado.id);
            if (!exists) {
                setSupervisados([...supervisados, supervisadoSeleccionado]);
            } else {
                alert('Este vendedor ya ha sido agregado.');
            }
            setSupervisadoSeleccionado(null);
        }
    };

    const deleteItem = (index) => {
        const nuevoSupervisado = supervisados.filter((_, i) => i !== index);
        setSupervisados(nuevoSupervisado);
    };

    const initialValues = {
        id: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        calle: '',
        ciudad: '',
        codigoPostal: '',
        colonia: '',
        curp: '',
        estado: '',
        fechaAlta: dayjs().startOf('day'),
        numeroInterior: '',
        numeroExterior: '',
        regimen: '',
        rfc: '',
        telefono1: '',
        telefono2: '',
        idSupervisor: '',
        clavesSupervisados: '',
        supervisor:'',
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
                    ciudad: values.ciudad,
                    codigoPostal: values.codigoPostal,
                    colonia: values.colonia,
                    curp: values.curp,
                    estado: values.estado,
                    fechaAlta: dayjs.utc(values.fechaAlta).local().format('DD/MM/YYYY HH:mm:ss'),
                    numeroInterior: values.numeroInterior,
                    numeroExterior: values.numeroExterior,
                    numeroTarjeta: values.numeroTarjeta,
                    regimen: values.regimen,
                    rfc: values.rfc,
                    telefono1: values.telefono1,
                    telefono2: values.telefono2,
                    idSupervisor: supervisorSeleccionado?.id,
                    clavesSupervisados: supervisados.map(item => ({
                        id: item.id,
                    })),
                };

                const response = (modo === "editar" ? actualizarVendedorApi(formData.id, formData) : crearVendedorApi(formData))
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
                console.log(`Error inesperado ${values.id ? ' actualizando' : ' creando'} vendedor: ${err.message}`, "error");
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    const redAsteriskStyle = {
        '& .MuiInputLabel-asterisk': {
            color: 'red',
        },
    };

    const nombreRef = useRef();
    const apellidoPaternoRef = useRef();
    const apellidoMaternoRef = useRef();
    const calleRef = useRef();
    const ciudadRef = useRef();
    const codigoPostalRef = useRef();
    const coloniaRef = useRef();
    const curpRef = useRef();
    const estadoRef = useRef();
    const fechaAltaRef = useRef();
    const numeroInteriorRef = useRef();
    const numeroExteriorRef = useRef();
    const numeroTarjetaRef = useRef();
    const regimenRef = useRef();
    const rfcRef = useRef();
    const telefono1Ref = useRef();
    const telefono2Ref = useRef();
    const supervisorRef = useRef();

    const handleReset = () => {
        formik.resetForm({
            values: initialValues,
        });
    };

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus(); // Focus the next input if it exists
            }
        }
    };

    const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open);
    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="lg" PaperProps={dialogPaperProps}>
            <DialogTitle {...dialogTitleProps} sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2, cursor: 'move' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        {modo === 'editar' ? 'Editar vendedor' : 'Crear vendedor'}
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '1100px', margin: 'auto', mt: 0 }}
                    >
                        <Typography variant="h5" component="h1" gutterBottom>
                            {modo === 'editar' ? 'Editar vendedor' : 'Crear vendedor'}
                        </Typography>
                        <Typography >Datos personales:</Typography>
                        <Grid container spacing={2}>
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
                                    onKeyDown={(e) => handleKeyDown(e, apellidoPaternoRef)}
                                    inputRef={nombreRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, apellidoMaternoRef)}
                                    inputRef={apellidoPaternoRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, calleRef)}
                                    inputRef={apellidoMaternoRef}
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography > Domicilio:</Typography>
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
                                    onKeyDown={(e) => handleKeyDown(e, numeroInteriorRef)}
                                    inputRef={calleRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, numeroExteriorRef)}
                                    inputRef={numeroInteriorRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, coloniaRef)}
                                    inputRef={numeroExteriorRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, ciudadRef)}
                                    inputRef={coloniaRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, estadoRef)}
                                    inputRef={ciudadRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, codigoPostalRef)}
                                    inputRef={estadoRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, telefono1Ref)}
                                    inputRef={codigoPostalRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, telefono2Ref)}
                                    inputRef={telefono1Ref}
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
                                    onKeyDown={(e) => handleKeyDown(e, regimenRef)}
                                    inputRef={telefono2Ref}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="regimen"
                                    name="regimen"
                                    label="Régimen"
                                    value={formik.values.regimen}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.regimen && Boolean(formik.errors.regimen)}
                                    helperText={formik.touched.regimen && formik.errors.regimen}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, rfcRef)}
                                    inputRef={regimenRef}
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
                                    onKeyDown={(e) => handleKeyDown(e, curpRef)}
                                    inputRef={rfcRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="curp"
                                    name="curp"
                                    label="CURP"
                                    value={formik.values.curp}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.curp && Boolean(formik.errors.curp)}
                                    helperText={formik.touched.curp && formik.errors.curp}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, numeroTarjetaRef)}
                                    inputRef={curpRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    id="numeroTarjeta"
                                    name="numeroTarjeta"
                                    label="Número tarjeta"
                                    value={formik.values.numeroTarjeta}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.numeroTarjeta && Boolean(formik.errors.numeroTarjeta)}
                                    helperText={formik.touched.numeroTarjeta && formik.errors.numeroTarjeta}
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                    onKeyDown={(e) =>handleKeyDown(e, fechaAltaRef) }
                                    inputRef={numeroTarjetaRef}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <DateTimePicker
                                        id="fechaAlta"
                                        name="fechaAlta"
                                        label="Fecha de alta"
                                        required
                                        value={formik.values.fechaAlta}
                                        onChange={(newValue) => {
                                            const utcValue = newValue.utc();
                                            formik.setFieldValue('fechaAlta', newValue)
                                        }}
                                        format="DD/MM/YYYY HH:mm:ss"
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                        }}
                                        inputRef={fechaAltaRef}
                                        onKeyDown={(e) =>handleKeyDown(e, supervisorRef)}
                                        slotProps={{
                                            textField: {
                                                name: "fechaAlta",
                                                onBlur: formik.handleBlur,
                                                error: formik.touched.fechaAlta && Boolean(formik.errors.fechaAlta),
                                                helperText: formik.touched.fechaAlta && formik.errors.fechaAlta,
                                                size: "small",
                                                InputLabelProps: {
                                                    sx: redAsteriskStyle,
                                                    shrink: true,
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography >Supervisor:</Typography>
                        <Grid container spacing={2}>
                            <Grid xs={12} sm={4}>
                                <Box sx={{ display: 'flex', border: 0 }} >
                                    <Box sx={{ display: 'flex', border: 0 }} >
                                        <Autocomplete
                                            options={supervisores}
                                            getOptionLabel={(option) => option.nombre + " " + option.apellidoPaterno + " " + option.apellidoMaterno}
                                            style={{ width: 400 }}
                                            value={formik.values.supervisor}
                                            onChange={(event, newValue) => {
                                                setSupervisorSeleccionado(newValue);
                                            }}
                                            includeInputInList
                                            freeSolo
                                            isOptionEqualToValue={(option, value) =>
                                                option.id === value.id
                                            }
                                            inputRef={supervisorRef}
                                            onKeyDown={(e) =>handleKeyDown(e, null)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Seleccionar supervisor"
                                                    fullWidth
                                                    size="small"
                                                    InputLabelProps={{
                                                        sx: redAsteriskStyle,
                                                        shrink: true,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Divider />
                            <Typography >Supervisados:</Typography>
                            <Grid xs={12} sm={4}>
                                <Grid container spacing={2} >
                                    <Autocomplete
                                        options={vendedores}
                                        getOptionLabel={(option) => `${option.nombre} ${option.apellidoPaterno} ${option.apellidoMaterno} (ID: ${option.id})`}
                                        sx={{ width: 300, marginBottom: '16px', '& .MuiInputBase-root': { height: 40 } }} // Adjust height here
                                        value={supervisadoSeleccionado}
                                        onChange={(event, newValue) => setSupervisadoSeleccionado(newValue)}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label="Seleccionar vendedor"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    sx: redAsteriskStyle,
                                                    shrink: true,
                                                }}
                                            />}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Add />}
                                        onClick={addItem}
                                        disabled={!supervisadoSeleccionado}
                                        sx={{ marginBottom: '16px' }}
                                    >
                                        Agregar
                                    </Button>
                                </Grid>
                                <Box sx={{ height: '100px', maxHeight: '100px', overflowY: 'auto', border: '1px solid #ccc' }}>
                                    <List>
                                        {supervisados.map((item, index) => (
                                            <ListItem
                                                key={item.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    padding: '1px 4px',
                                                    marginBottom: 'px' 
                                                }}
                                            >
                                                <ListItemText
                                                    primary={`${item.id}.- ${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno}`}
                                                />
                                                <IconButton onClick={() => deleteItem(index)} color="warning" size="small">
                                                    <Delete />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Grid>
                        </Grid>
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