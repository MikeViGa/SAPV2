import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import { actualizarClienteApi, crearClienteApi, obtenerClienteApi } from '../../api/ClienteApiService';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CheckIcon from '@mui/icons-material/Check';
import { Dialog, DialogActions, DialogContent, } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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

    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);
    const [indiceEditando, setIndiceEditando] = useState(null);
    const [dialogoDomicilioAbierto, setDialogoDomicilioAbierto] = useState(false);
    const [nuevoDomicilio, setNuevoDomicilio] = useState({
        calle: '', numeroInterior: '', numeroExterior: '', colonia: '', ciudad: '', codigoPostal: '', entreCalles: ''
    });
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(customParseFormat);
    dayjs.tz.setDefault("America/Mexico_City");

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
                        entreCalles: d.entreCalles || ''
                    })) || [],
                    telefono1: values.telefono1,
                    telefono2: values.telefono2,
                    rfc: values.rfc,
                    fechaRegistro: values.fechaRegistro ? values.fechaRegistro.format('DD/MM/YYYY HH:mm:ss') : null,
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
        const cargarDetalleSiEdita = async () => {
            if (!open) return;
            if (modo === "editar" && registro?.id) {
                try {
                    setLoading(true);
                    const resp = await obtenerClienteApi(registro.id);
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
                            entreCalles: d.entreCalles || ''
                        })) : [],
                        telefono1: det.telefono1 ?? registro.telefono1 ?? '',
                        telefono2: det.telefono2 ?? registro.telefono2 ?? '',
                        rfc: det.rfc ?? registro.rfc ?? '',
                        fechaRegistro: det.fechaRegistro ? dayjs(det.fechaRegistro, 'DD/MM/YYYY HH:mm:ss') : null,
                    });
                } catch (e) {
                    addSnackbar('No se pudo cargar el detalle del cliente', 'error');
                } finally {
                    setLoading(false);
                }
            } else if (open) {
                formik.resetForm({ values: initialValues });
            }
        };
        cargarDetalleSiEdita();
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
                        <Typography sx={{ mb: 1 }}>Domicilios:</Typography>
                        <List dense sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #eee' }}>
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
                                                    <Grid xs={12} sm={3}>
                                                        <TextField size="small" fullWidth label="Calle" value={domicilio.calle}
                                                            onChange={(e) => { const a = [...formik.values.domicilios]; a[index].calle = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                    </Grid>
                                                    <Grid xs={12} sm={2}>
                                                        <TextField size="small" fullWidth label="Num. Interior" value={domicilio.numeroInterior}
                                                            onChange={(e) => { const a = [...formik.values.domicilios]; a[index].numeroInterior = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                    </Grid>
                                                    <Grid xs={12} sm={2}>
                                                        <TextField size="small" fullWidth label="Num. Exterior" value={domicilio.numeroExterior}
                                                            onChange={(e) => { const a = [...formik.values.domicilios]; a[index].numeroExterior = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                    </Grid>
                                                    <Grid xs={12} sm={2}>
                                                        <TextField size="small" fullWidth label="Colonia" value={domicilio.colonia}
                                                            onChange={(e) => { const a = [...formik.values.domicilios]; a[index].colonia = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                    </Grid>
                                                    <Grid xs={12} sm={2}>
                                                        <TextField size="small" fullWidth label="Ciudad" value={domicilio.ciudad}
                                                            onChange={(e) => { const a = [...formik.values.domicilios]; a[index].ciudad = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                    </Grid>
                                                    <Grid xs={12} sm={1}>
                                                        <TextField size="small" fullWidth label="CP" value={domicilio.codigoPostal}
                                                            onChange={(e) => { const a = [...formik.values.domicilios]; a[index].codigoPostal = e.target.value; formik.setFieldValue('domicilios', a); }} />
                                                    </Grid>
                                                    <Grid xs={12} sm={4}>
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
                                setNuevoDomicilio({ calle: '', numeroInterior: '', numeroExterior: '', colonia: '', ciudad: '', codigoPostal: '', entreCalles: '' });
                                setDialogoDomicilioAbierto(true);
                            }}>Agregar domicilio</Button>
                        </Box>

                        <Dialog open={dialogoDomicilioAbierto} onClose={() => setDialogoDomicilioAbierto(false)} fullWidth maxWidth="sm">
                            <DialogContent>
                                <Typography variant="h6" gutterBottom>Nuevo domicilio</Typography>
                                <Grid container spacing={1}>
                                    <Grid xs={12} sm={6}>
                                        <TextField size="small" fullWidth label="Calle" required value={nuevoDomicilio.calle}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, calle: e.target.value })}
                                            InputLabelProps={{ sx: redAsteriskStyle, shrink: true }} />
                                    </Grid>
                                    <Grid xs={12} sm={3}>
                                        <TextField size="small" fullWidth label="Num. Interior" value={nuevoDomicilio.numeroInterior}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, numeroInterior: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={3}>
                                        <TextField size="small" fullWidth label="Num. Exterior" value={nuevoDomicilio.numeroExterior}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, numeroExterior: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField size="small" fullWidth label="Colonia" value={nuevoDomicilio.colonia}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, colonia: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={4}>
                                        <TextField size="small" fullWidth label="Ciudad" value={nuevoDomicilio.ciudad}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, ciudad: e.target.value })} />
                                    </Grid>
                                    <Grid xs={12} sm={2}>
                                        <TextField size="small" fullWidth label="CP" value={nuevoDomicilio.codigoPostal}
                                            onChange={(e) => setNuevoDomicilio({ ...nuevoDomicilio, codigoPostal: e.target.value })} />
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