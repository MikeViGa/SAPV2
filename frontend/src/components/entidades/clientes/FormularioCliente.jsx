import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, IconButton, Divider, MenuItem, Paper } from '@mui/material';
import { actualizarClienteApi, crearClienteApi, obtenerClienteApi } from '../../api/ClienteApiService';
import { obtenerEstadosCivilesApi } from '../../api/EstadoCivilApiService';
import { obtenerEstadosApi } from '../../api/EstadoApiService';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CheckIcon from '@mui/icons-material/Check';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDraggableDialog } from '../../base/common/useDraggableDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import Cargando from '../../base/dashboard/elementos/Cargando';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import Grid from '@mui/material/Grid2';
import { Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';


export default function FormularioCliente({ modo, registro, open, onClose, refrescar }) {
    const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open);
    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);
    const [indiceEditando, setIndiceEditando] = useState(null);
    const [dialogoDomicilioAbierto, setDialogoDomicilioAbierto] = useState(false);
    const [nuevoDomicilio, setNuevoDomicilio] = useState({
        calle: '', numeroInterior: '', numeroExterior: '', colonia: '', ciudad: '', codigoPostal: '', entreCalles: '', estadoId: ''
    });
    const [estadosCiviles, setEstadosCiviles] = useState([]);
    const [estados, setEstados] = useState([]);
    const [catalogosCargados, setCatalogosCargados] = useState(false);
    const [detallesCargados, setDetallesCargados] = useState(false);
    const hasLoadedRef = useRef(null);
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(customParseFormat);
    dayjs.tz.setDefault("America/Mexico_City");

    const parseToDayjs = (value) => {
        if (!value) return null;
        const parsed = dayjs(value, ["DD/MM/YYYY HH:mm:ss", "DD/MM/YYYY"], true);
        return parsed.isValid() ? parsed : null;
    };

    const initialValues = {
        id: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        domicilios: [],
        telefono1: '',
        telefono2: '',
        rfc: '',
        fechaRegistro: null,
        fechaNacimiento: null,
        ocupacion: '',
        regimen: '',
        estadoCivilId: '',
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
                    domicilios: values.domicilios?.map(d => ({
                        id: d.id || undefined,
                        calle: d.calle || '',
                        numeroInterior: d.numeroInterior || '',
                        numeroExterior: d.numeroExterior || '',
                        colonia: d.colonia || '',
                        ciudad: d.ciudad || '',
                        codigoPostal: d.codigoPostal || '',
                        entreCalles: d.entreCalles || '',
                        estado: d.estadoId ? { id: d.estadoId } : null,
                    })) || [],
                    telefono1: values.telefono1,
                    telefono2: values.telefono2,
                    rfc: values.rfc,
                    fechaRegistro: values.fechaRegistro ? values.fechaRegistro.format('DD/MM/YYYY HH:mm:ss') : null,
                    fechaNacimiento: values.fechaNacimiento ? values.fechaNacimiento.format('DD/MM/YYYY HH:mm:ss') : null,
                    ocupacion: values.ocupacion,
                    regimen: values.regimen,
                    estadoCivilId: values.estadoCivilId,
                    estadoCivil: values.estadoCivilId ? { id: values.estadoCivilId } : null,
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

    // Cargar catálogos (estados civiles y estados) al abrir
    useEffect(() => {
        if (!open) return;
        let isActive = true;
        setCatalogosCargados(false);

        (async () => {
            try {
                const ecCache = sessionStorage.getItem('catalogo_estados_civiles');
                const estadosCache = sessionStorage.getItem('catalogo_estados');

                if (ecCache) setEstadosCiviles(JSON.parse(ecCache));
                else {
                    const resp = await obtenerEstadosCivilesApi();
                    if (!isActive) return;
                    const data = resp?.data || [];
                    setEstadosCiviles(data);
                    sessionStorage.setItem('catalogo_estados_civiles', JSON.stringify(data));
                }

                if (estadosCache) setEstados(JSON.parse(estadosCache));
                else {
                    const resp = await obtenerEstadosApi();
                    if (!isActive) return;
                    const data = resp?.data || [];
                    setEstados(data);
                    sessionStorage.setItem('catalogo_estados', JSON.stringify(data));
                }
            } catch (e) {
                if (!isActive) return;
                console.error('Error cargando catálogos:', e);
            } finally {
                if (!isActive) return;
                setCatalogosCargados(true);
            }
        })();

        return () => { isActive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Cargar detalle si edita
    useEffect(() => {
        const key = `${open ? '1' : '0'}-${modo || 'null'}-${registro?.id ?? 'null'}`;
        if (!open) return;
        if (hasLoadedRef.current === key) return;
        hasLoadedRef.current = key;
        let isActive = true;
        const cargarDetalleSiEdita = async () => {
            if (modo === "editar" && registro?.id) {
                setDetallesCargados(false);
                try {
                    setLoading(true);
                    const resp = await obtenerClienteApi(registro.id);
                    if (!isActive) return;
                    const det = typeof resp.data === 'string' ? JSON.parse(resp.data) : resp.data;
                    formik.setValues({
                        id: det.id || registro.id || '',
                        nombre: det.nombre ?? registro.nombre ?? '',
                        apellidoPaterno: det.apellidoPaterno ?? registro.apellidoPaterno ?? '',
                        apellidoMaterno: det.apellidoMaterno ?? registro.apellidoMaterno ?? '',
                        domicilios: Array.isArray(det.domicilios) ? det.domicilios.map(d => ({
                            id: d.id,
                            calle: d.calle || '',
                            numeroInterior: d.numeroInterior || '',
                            numeroExterior: d.numeroExterior || '',
                            colonia: d.colonia || '',
                            ciudad: d.ciudad || '',
                            codigoPostal: d.codigoPostal || '',
                            entreCalles: d.entreCalles || '',
                            estadoId: d.estadoId || '',
                        })) : [],
                        telefono1: det.telefono1 ?? registro.telefono1 ?? '',
                        telefono2: det.telefono2 ?? registro.telefono2 ?? '',
                        rfc: det.rfc ?? registro.rfc ?? '',
                        fechaRegistro: parseToDayjs(det.fechaRegistro),
                        fechaNacimiento: parseToDayjs(det.fechaNacimiento),
                        ocupacion: det.ocupacion ?? registro.ocupacion ?? '',
                        regimen: det.regimen ?? registro.regimen ?? '',
                        estadoCivilId: det.estadoCivilId ?? registro.estadoCivilId ?? '',
                    });
                } catch (e) {
                    if (!isActive) return;
                    addSnackbar('No se pudo cargar el detalle del cliente', 'error');
                } finally {
                    if (!isActive) return;
                    setLoading(false);
                    setDetallesCargados(true);
                }
            } else if (open) {
                formik.resetForm({ values: initialValues });
                setDetallesCargados(true);
            }
        };
        cargarDetalleSiEdita();
        return () => { isActive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registro?.id, modo, open]);

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
    const fechaNacimientoRef = useRef();
    const numeroInteriorRef = useRef();
    const numeroExteriorRef = useRef();
    const rfcRef = useRef();
    const telefono1Ref = useRef();
    const telefono2Ref = useRef();

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const cargandoGlobal = !catalogosCargados || (modo === 'editar' && !detallesCargados);
    // Define responsive width for Estado Civil select: wider on create mode
    // const colEstadoCivilMd = modo === 'editar' ? 3 : 4; // Removed dynamic width var

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="lg" PaperProps={dialogPaperProps}>
            <DialogTitle {...dialogTitleProps} sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2, cursor: 'move' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        {modo === 'editar' ? 'Editar cliente' : 'Crear cliente'}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close" sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <Cargando loading={cargandoGlobal} />
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '950px', margin: 'auto', mt: 2 }}
                    >
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
                            <Grid container spacing={1} sx={{ mb: 2 }}>
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
                                <Grid xs={12} sm={6} md={3}>
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
                                <Grid xs={12} sm={6} md={3}>
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
                                <Grid xs={12} sm={6} md={3}>
                                    <TextField
                                        size="small"
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
                                            shrink: true,
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, null)}
                                    />
                                </Grid>
                            </Grid>

                            {/* Fila 2: Ocupación, Régimen, Teléfono 1, Teléfono 2 */}
                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid xs={12} sm={6} md={3}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ocupacion"
                                        name="ocupacion"
                                        label="Ocupación"
                                        value={formik.values.ocupacion}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.ocupacion && Boolean(formik.errors.ocupacion)}
                                        helperText={formik.touched.ocupacion && formik.errors.ocupacion}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, null)}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <TextField
                                        size="small"
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
                                            shrink: true,
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, null)}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="telefono1"
                                        name="telefono1"
                                        label="Teléfono 1"
                                        value={formik.values.telefono1}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.telefono1 && Boolean(formik.errors.telefono1)}
                                        helperText={formik.touched.telefono1 && formik.errors.telefono1}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, null)}
                                        inputRef={telefono2Ref}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="telefono2"
                                        name="telefono2"
                                        label="Teléfono 2"
                                        value={formik.values.telefono2}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.telefono2 && Boolean(formik.errors.telefono2)}
                                        helperText={formik.touched.telefono2 && formik.errors.telefono2}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, null)}
                                        inputRef={rfcRef}
                                    />
                                </Grid>
                            </Grid>

                            {/* Fila 3: Fecha de nacimiento, Estado civil, Fecha de registro */}
                            <Grid container spacing={1}>
                                <Grid xs={12} sm={6} md={3}>
                                    <DateTimePicker
                                        id="fechaNacimiento"
                                        name="fechaNacimiento"
                                        label="Fecha de nacimiento"
                                        value={formik.values.fechaNacimiento}
                                        onChange={(newValue) => {
                                            formik.setFieldValue('fechaNacimiento', newValue)
                                        }}
                                        format="DD/MM/YYYY HH:mm:ss"
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                        }}
                                        slotProps={{
                                            textField: {
                                                name: "fechaNacimiento",
                                                onBlur: formik.handleBlur,
                                                error: formik.touched.fechaNacimiento && Boolean(formik.errors.fechaNacimiento),
                                                helperText: formik.touched.fechaNacimiento && formik.errors.fechaNacimiento,
                                                size: "small",
                                                fullWidth: true,
                                                InputLabelProps: {
                                                    shrink: true,
                                                },
                                                onKeyDown: (e) => handleKeyDown(e, null),
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid xs={12} sm={6} md={3}>
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
                                                fullWidth: true,
                                                InputLabelProps: {
                                                    sx: redAsteriskStyle,
                                                    shrink: true,
                                                },
                                                onKeyDown: (e) => handleKeyDown(e, estadoRef),
                                                inputRef: fechaRegistroRef,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <TextField
                                        select
                                        size="small"
                                        fullWidth
                                        id="estadoCivilId"
                                        name="estadoCivilId"
                                        label="Estado civil"
                                        value={formik.values.estadoCivilId === null ? '' : formik.values.estadoCivilId}
                                        onChange={(e) => {
                                            const newValue = e.target.value === '' ? '' : Number(e.target.value);
                                            formik.setFieldValue('estadoCivilId', newValue);
                                        }}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.estadoCivilId && Boolean(formik.errors.estadoCivilId)}
                                        helperText={formik.touched.estadoCivilId && formik.errors.estadoCivilId}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, null)}
                                    >
                                        <MenuItem value="">Seleccionar estado civil</MenuItem>
                                        {(estadosCiviles || []).map((estadoCivil) => (
                                            <MenuItem key={estadoCivil.id} value={estadoCivil.id}>
                                                {estadoCivil.nombre}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid xs={12} sm={6} md={3}></Grid>
                            </Grid>
                        </Paper>
                        <Paper elevation={1} sx={{ p: 1, mb: 0 }}>
                            <Typography sx={{ mb: 1 }}>Domicilios:</Typography>
                            <List dense sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 0 }}>
                                {(formik.values.domicilios || []).map((domicilio, index) => {
                                    const resumen = `${domicilio.calle || ''} ${domicilio.numeroExterior || ''}${domicilio.numeroInterior ? ' Int ' + domicilio.numeroInterior : ''}, ${domicilio.colonia || ''}, ${domicilio.ciudad || ''} ${domicilio.codigoPostal ? 'CP ' + domicilio.codigoPostal : ''}`;
                                    return (
                                        <Box key={domicilio.id || index}>
                                            <ListItem
                                                secondaryAction={
                                                    <Box>
                                                        {indiceEditando === index ? (
                                                            <IconButton edge="end" aria-label="done" onClick={() => setIndiceEditando(null)}>
                                                                <CheckIcon color="success" />
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton edge="end" aria-label="edit" onClick={() => setIndiceEditando(index)}>
                                                                <EditIcon color="primary" />
                                                            </IconButton>
                                                        )}
                                                        <IconButton edge="end" aria-label="delete" onClick={() => {
                                                            const arr = [...formik.values.domicilios];
                                                            arr.splice(index, 1);
                                                            formik.setFieldValue('domicilios', arr);
                                                            if (indiceEditando === index) setIndiceEditando(null);
                                                        }}>
                                                            <DeleteIcon color="warning" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            >
                                                <ListItemText
                                                    primary={resumen.trim() || `Domicilio ${index + 1}`}
                                                    secondary={domicilio.entreCalles ? `Entre calles: ${domicilio.entreCalles}` : null}
                                                />
                                            </ListItem>
                                            {indiceEditando === index && (
                                                <Box sx={{ px: 2, pb: 1 }}>
                                                    <Grid container spacing={1}>
                                                        <Grid xs={12} sm={6} md={3}>
                                                            <TextField size="small" fullWidth label="Calle" value={domicilio.calle}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].calle = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                        </Grid>
                                                        <Grid xs={12} sm={3} md={1.5}>
                                                            <TextField size="small" fullWidth label="Num. Interior" value={domicilio.numeroInterior}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].numeroInterior = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                        </Grid>
                                                        <Grid xs={12} sm={3} md={1.5}>
                                                            <TextField size="small" fullWidth label="Num. Exterior" value={domicilio.numeroExterior}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].numeroExterior = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                        </Grid>
                                                        <Grid xs={12} sm={6} md={3}>
                                                            <TextField size="small" fullWidth label="Colonia" value={domicilio.colonia}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].colonia = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                        </Grid>
                                                        <Grid xs={12} sm={6} md={3}>
                                                            <TextField size="small" fullWidth label="Ciudad" value={domicilio.ciudad}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].ciudad = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                        </Grid>
                                                        <Grid xs={12} sm={3} md={1.5}>
                                                            <TextField size="small" fullWidth label="CP" value={domicilio.codigoPostal}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].codigoPostal = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                        </Grid>
                                                        <Grid xs={12} sm={6} md={3}>
                                                            <TextField select size="small" fullWidth label="Estado" value={domicilio.estadoId || ''}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].estadoId = e.target.value === '' ? '' : Number(e.target.value); formik.setFieldValue('domicilios', a); }}>
                                                                <MenuItem value="">Seleccionar</MenuItem>
                                                                {(estados || []).map((edo) => (
                                                                    <MenuItem key={edo.id} value={edo.id}>{edo.nombre}</MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </Grid>
                                                        <Grid xs={12} sm={3} md={1.5}>
                                                            <TextField size="small" fullWidth label="Entre calles" value={domicilio.entreCalles}
                                                                onChange={(e) => { const a = [...formik.values.domicilios]; a[index].entreCalles = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            )}
                                            <Divider />
                                        </Box>
                                    );
                                })}
                            </List>
                            <Box sx={{ mt: 1 }}>
                                <Button startIcon={<AddLocationAltIcon />} variant="contained" onClick={() => {
                                    setNuevoDomicilio({ calle: '', numeroInterior: '', numeroExterior: '', colonia: '', ciudad: '', codigoPostal: '', entreCalles: '', estadoId: '' });
                                    setDialogoDomicilioAbierto(true);
                                }}>Agregar domicilio</Button>
                            </Box>
                        </Paper>

                        <Dialog open={dialogoDomicilioAbierto} onClose={() => setDialogoDomicilioAbierto(false)} fullWidth maxWidth="sm">
                            <DialogContent>
                                <Typography variant="h6" gutterBottom>Nuevo domicilio</Typography>
                                <Grid container spacing={1}>
                                    <Grid xs={12} sm={12}>
                                        <TextField size="small" fullWidth label="Calle" required value={nuevoDomicilio.calle}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, calle: e.target.value })}
                                            InputLabelProps={{ sx: redAsteriskStyle, shrink: true }} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField size="small" fullWidth label="Num. Interior" value={nuevoDomicilio.numeroInterior}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, numeroInterior: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField size="small" fullWidth label="Num. Exterior" value={nuevoDomicilio.numeroExterior}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, numeroExterior: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField size="small" fullWidth label="Colonia" value={nuevoDomicilio.colonia}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, colonia: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField size="small" fullWidth label="Ciudad" value={nuevoDomicilio.ciudad}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, ciudad: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField size="small" fullWidth label="CP" value={nuevoDomicilio.codigoPostal}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, codigoPostal: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField select size="small" fullWidth label="Estado" value={nuevoDomicilio.estadoId || ''}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, estadoId: e.target.value === '' ? '' : Number(e.target.value) })}>
                                            <MenuItem value="">Seleccionar</MenuItem>
                                            {(estados || []).map((edo) => (
                                                <MenuItem key={edo.id} value={edo.id}>{edo.nombre}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid xs={12}>
                                        <TextField size="small" fullWidth label="Entre calles" value={nuevoDomicilio.entreCalles}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, entreCalles: e.target.value })} />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="text" onClick={() => setDialogoDomicilioAbierto(false)}>Cancelar</Button>
                                <Button variant="contained" onClick={() => {
                                    const arr = [...(formik.values.domicilios || [])];
                                    arr.push({ ...nuevoDomicilio });
                                    formik.setFieldValue('domicilios', arr);
                                    setDialogoDomicilioAbierto(false);
                                }}>Guardar</Button>
                            </DialogActions>
                        </Dialog>
                        <Paper elevation={1} sx={{ p: 1, mb: 1}}>
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
                        </Paper>
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
}