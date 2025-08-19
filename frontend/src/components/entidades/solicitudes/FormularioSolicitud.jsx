import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, MenuItem, Paper } from '@mui/material';
import { actualizarSolicitudApi, crearSolicitudApi, obtenerSolicitudApi } from '../../api/SolicitudApiService';
import { obtenerVendedoresApi } from '../../api/VendedorApiService';
import { obtenerClienteNombreApi } from '../../api/ClienteApiService';
import Autocomplete from '@mui/material/Autocomplete';
import { obtenerSucursalesApi } from '../../api/SucursalApiService';
import { obtenerPaquetesApi } from '../../api/PaqueteApiService';
// import { obtenerUsuariosApi } from '../../api/UsuarioApiService';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDraggableDialog } from '../../base/common/useDraggableDialog';
import IconButton from '@mui/material/IconButton';
import Cargando from '../../base/dashboard/elementos/Cargando';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import Grid from '@mui/material/Grid2';
import { Stack, Divider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

export default function FormularioSolicitud({ modo, registro, open, onClose, refrescar }) {
    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estados para catálogos
    const [vendedores, setVendedores] = useState([]);
    const [clienteOpciones, setClienteOpciones] = useState([]);
    const [clienteInput, setClienteInput] = useState('');
    const [sucursales, setSucursales] = useState([]);
    const [paquetes, setPaquetes] = useState([]);
    // Eliminado: se tomará el usuario de la sesión
    const [catalogosCargados, setCatalogosCargados] = useState(false);
    const [detallesCargados, setDetallesCargados] = useState(false);
    const hasLoadedRef = useRef(null);
    const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open, [catalogosCargados, detallesCargados]);

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(customParseFormat);
    dayjs.tz.setDefault("America/Mexico_City");

    const parseToDayjs = (value) => {
        if (!value) return null;
        const parsed = dayjs(value, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
        return parsed.isValid() ? parsed : null;
    };

    const initialValues = {
        id: '',
        claveSolicitud: '',
        fechaAlta: null,
        vendedorId: '',
        comision: '',
        paqueteId: '',
        fechaVencimiento: null,
        fechaVenta: null,
        fechaEntrega: null,
        clienteId: '',
        sucursalId: '',
        claveContrato: '',
        // Beneficiarios
        nombreBeneficiario1: '',
        apellidoPaternoBeneficiario1: '',
        apellidoMaternoBeneficiario1: '',
        nombreBeneficiario2: '',
        apellidoPaternoBeneficiario2: '',
        apellidoMaternoBeneficiario2: '',
        nombreBeneficiario3: '',
        apellidoPaternoBeneficiario3: '',
        apellidoMaternoBeneficiario3: ''
    };

    const validationSchema = Yup.object({
        claveSolicitud: Yup.string().required('Requerido'),
        comision: Yup.number().required('Requerido').min(0, 'Debe ser mayor o igual a 0'),
        fechaVencimiento: Yup.date().required('Requerido'),
        fechaVenta: Yup.date().required('Requerido'),
        vendedorId: Yup.string().required('Requerido'),
        clienteId: Yup.string().required('Requerido'),
        sucursalId: Yup.string().required('Requerido'),
        paqueteId: Yup.string().required('Requerido'),
        claveContrato: Yup.number().required('Requerido').min(1, 'Debe ser mayor a 0'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setLoading(true);
                let formData = {
                    id: values.id,
                    claveSolicitud: values.claveSolicitud,
                    fechaAlta: values.fechaAlta ? dayjs(values.fechaAlta).format('YYYY-MM-DD') : null,
                    vendedor: values.vendedorId ? { id: values.vendedorId } : null,
                    comision: parseFloat(values.comision),
                    paquete: values.paqueteId ? { id: values.paqueteId } : null,
                    fechaVencimiento: values.fechaVencimiento ? dayjs(values.fechaVencimiento).format('YYYY-MM-DD') : null,
                    fechaVenta: values.fechaVenta ? dayjs(values.fechaVenta).format('YYYY-MM-DD') : null,
                    fechaEntrega: values.fechaEntrega ? dayjs(values.fechaEntrega).format('YYYY-MM-DD') : null,
                    cliente: values.clienteId ? { id: values.clienteId } : null,
                    sucursal: values.sucursalId ? { id: values.sucursalId } : null,
                    claveContrato: parseInt(values.claveContrato),
                    // usuario se infiere desde el backend usando el token de sesión
                    nombreBeneficiario1: values.nombreBeneficiario1,
                    apellidoPaternoBeneficiario1: values.apellidoPaternoBeneficiario1,
                    apellidoMaternoBeneficiario1: values.apellidoMaternoBeneficiario1,
                    nombreBeneficiario2: values.nombreBeneficiario2,
                    apellidoPaternoBeneficiario2: values.apellidoPaternoBeneficiario2,
                    apellidoMaternoBeneficiario2: values.apellidoMaternoBeneficiario2,
                    nombreBeneficiario3: values.nombreBeneficiario3,
                    apellidoPaternoBeneficiario3: values.apellidoPaternoBeneficiario3,
                    apellidoMaternoBeneficiario3: values.apellidoMaternoBeneficiario3
                };

                const response = (modo === "editar" ? actualizarSolicitudApi(formData.id, formData) : crearSolicitudApi(formData))
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
                console.log(`Error inesperado ${values.id ? ' actualizando' : ' creando'} solicitud: ${err.message}`, "error");
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    // Cargar catálogos
    useEffect(() => {
        const cargarCatalogos = async () => {
            if (!open || catalogosCargados) return;

            try {
                console.log('Cargando catálogos...');
                const [vendedoresRes, sucursalesRes, paquetesRes] = await Promise.all([
                    obtenerVendedoresApi(),
                    obtenerSucursalesApi(),
                    obtenerPaquetesApi()
                ]);

                const vendedoresListado = Array.isArray(vendedoresRes.data) ? vendedoresRes.data : [];
                vendedoresListado.sort((a, b) => `${a.nombre || ''} ${a.apellidoPaterno || ''}`.localeCompare(`${b.nombre || ''} ${b.apellidoPaterno || ''}`, 'es', { sensitivity: 'base' }));
                setVendedores(vendedoresListado);
                // clienteOpciones se cargarán bajo demanda vía autocomplete
                setSucursales(Array.isArray(sucursalesRes.data) ? sucursalesRes.data : []);
                setPaquetes(Array.isArray(paquetesRes.data) ? paquetesRes.data : []);
                // usuarios eliminado

                setCatalogosCargados(true);
                console.log('Catálogos cargados exitosamente');
            } catch (error) {
                console.error('Error cargando catálogos:', error);
                addSnackbar('Error cargando catálogos: ' + error.message, 'error');
            }
        };

        cargarCatalogos();
    }, [open]);

    // Cargar detalles del registro para edición
    useEffect(() => {
        const cargarDetalles = async () => {
            if (!open || !catalogosCargados) return;

            if (modo === "editar" && registro && !detallesCargados && hasLoadedRef.current !== registro.id) {
                try {
                    console.log('Cargando detalles del registro:', registro.id);
                    const response = await obtenerSolicitudApi(registro.id);
                    const data = response.data;

                    // Mapear los datos al formato del formulario
                    const formValues = {
                        id: data.id || '',
                        claveSolicitud: data.claveSolicitud || '',
                        fechaAlta: parseToDayjs(data.fechaAlta),
                        vendedorId: data.vendedor?.id || '',
                        comision: data.comision || '',
                        paqueteId: data.paquete?.id || '',
                        fechaVencimiento: parseToDayjs(data.fechaVencimiento),
                        fechaVenta: parseToDayjs(data.fechaVenta),
                        fechaEntrega: parseToDayjs(data.fechaEntrega),
                        clienteId: data.cliente?.id || '',
                        sucursalId: data.sucursal?.id || '',
                        claveContrato: data.claveContrato || '',
                        // usuarioId eliminado
                        nombreBeneficiario1: data.nombreBeneficiario1 || '',
                        apellidoPaternoBeneficiario1: data.apellidoPaternoBeneficiario1 || '',
                        apellidoMaternoBeneficiario1: data.apellidoMaternoBeneficiario1 || '',
                        nombreBeneficiario2: data.nombreBeneficiario2 || '',
                        apellidoPaternoBeneficiario2: data.apellidoPaternoBeneficiario2 || '',
                        apellidoMaternoBeneficiario2: data.apellidoMaternoBeneficiario2 || '',
                        nombreBeneficiario3: data.nombreBeneficiario3 || '',
                        apellidoPaternoBeneficiario3: data.apellidoPaternoBeneficiario3 || '',
                        apellidoMaternoBeneficiario3: data.apellidoMaternoBeneficiario3 || ''
                    };

                    formik.setValues(formValues);
                    setDetallesCargados(true);
                    hasLoadedRef.current = registro.id;
                    console.log('Detalles cargados y formulario actualizado');
                } catch (error) {
                    console.error('Error cargando detalles:', error);
                    addSnackbar('Error cargando datos de la solicitud: ' + error.message, 'error');
                }
            } else if (modo === "nuevo") {
                formik.resetForm({ values: initialValues });
                setDetallesCargados(true);
            }
        };

        cargarDetalles();
    }, [catalogosCargados, modo, registro, open]);

    // Reset cuando se cierra el modal
    useEffect(() => {
        if (!open) {
            setCatalogosCargados(false);
            setDetallesCargados(false);
            setOperacionTerminada(false);
            hasLoadedRef.current = null;
        }
    }, [open]);

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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth="xl"
            PaperProps={dialogPaperProps}
        >
            <DialogTitle {...dialogTitleProps} sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2, cursor: 'move' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        {modo === 'editar' ? 'Editar solicitud' : 'Crear solicitud'}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close" sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {loading || !catalogosCargados || !detallesCargados ? (
                    <Cargando loading={true} />
                ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            component="form"
                            onSubmit={formik.handleSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                width: '100%',
                                maxWidth: 1200,
                                margin: 'auto',
                                mt: 1
                            }}
                        >
                            {/* Datos básicos */}
                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, '& .MuiTextField-root': { width: '100%' } }}>
                                    <Box>
                                        <TextField size="small" required fullWidth id="claveSolicitud" name="claveSolicitud" label="Clave de solicitud" value={formik.values.claveSolicitud} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.claveSolicitud && Boolean(formik.errors.claveSolicitud)} helperText={formik.touched.claveSolicitud && formik.errors.claveSolicitud} InputLabelProps={{ sx: redAsteriskStyle, shrink: true }} />
                                    </Box>
                                    <Box>
                                        <TextField size="small" required fullWidth id="claveContrato" name="claveContrato" label="Clave de contrato" type="number" value={formik.values.claveContrato} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.claveContrato && Boolean(formik.errors.claveContrato)} helperText={formik.touched.claveContrato && formik.errors.claveContrato} InputLabelProps={{ sx: redAsteriskStyle, shrink: true }} />
                                    </Box>
                                    <Box>
                                        <TextField size="small" required fullWidth id="comision" name="comision" label="Comisión" type="number" step="0.01" value={formik.values.comision} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.comision && Boolean(formik.errors.comision)} helperText={formik.touched.comision && formik.errors.comision} InputLabelProps={{ sx: redAsteriskStyle, shrink: true }} />
                                    </Box>
                                    <Box>
                                        <DatePicker label="Fecha de alta" value={formik.values.fechaAlta} onChange={(newValue) => formik.setFieldValue('fechaAlta', newValue)} slotProps={{ textField: { size: 'small', fullWidth: true, InputLabelProps: { shrink: true } } }} />
                                    </Box>
                                    <Box>
                                        <DatePicker label="Fecha de venta *" value={formik.values.fechaVenta} onChange={(newValue) => formik.setFieldValue('fechaVenta', newValue)} slotProps={{ textField: { size: 'small', fullWidth: true, required: true, error: formik.touched.fechaVenta && Boolean(formik.errors.fechaVenta), helperText: formik.touched.fechaVenta && formik.errors.fechaVenta, InputLabelProps: { shrink: true, sx: redAsteriskStyle } } }} />
                                    </Box>
                                    <Box>
                                        <DatePicker label="Fecha de vencimiento *" value={formik.values.fechaVencimiento} onChange={(newValue) => formik.setFieldValue('fechaVencimiento', newValue)} slotProps={{ textField: { size: 'small', fullWidth: true, required: true, error: formik.touched.fechaVencimiento && Boolean(formik.errors.fechaVencimiento), helperText: formik.touched.fechaVencimiento && formik.errors.fechaVencimiento, InputLabelProps: { shrink: true, sx: redAsteriskStyle } } }} />
                                    </Box>
                                    <Box>
                                        <DatePicker label="Fecha de entrega" value={formik.values.fechaEntrega} onChange={(newValue) => formik.setFieldValue('fechaEntrega', newValue)} slotProps={{ textField: { size: 'small', fullWidth: true, InputLabelProps: { shrink: true } } }} />
                                    </Box>
                                    <Box>
                                        <TextField size="small" required select fullWidth id="vendedorId" name="vendedorId" label="Vendedor" value={formik.values.vendedorId} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.vendedorId && Boolean(formik.errors.vendedorId)} helperText={formik.touched.vendedorId && formik.errors.vendedorId} InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}>
                                            {vendedores.map((vendedor) => (
                                                <MenuItem key={vendedor.id} value={vendedor.id}>
                                                    {vendedor.nombre} {vendedor.apellidoPaterno}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    <Box>
                                        <Autocomplete
                                            fullWidth
                                            freeSolo
                                            filterOptions={(x) => x}
                                            options={clienteOpciones}
                                            getOptionLabel={(opcion) => opcion?.nombre ? `${opcion.nombre} ${opcion.apellidoPaterno || ''} ${opcion.apellidoMaterno || ''}`.trim() : ''}
                                            value={clienteOpciones.find(o => o.id === formik.values.clienteId) || null}
                                            onInputChange={async (event, nuevoValor) => {
                                                setClienteInput(nuevoValor);
                                                if (nuevoValor && nuevoValor.length >= 3) {
                                                    try {
                                                        const resp = await obtenerClienteNombreApi(nuevoValor);
                                                        const lista = Array.isArray(resp.data) ? resp.data : [];
                                                        setClienteOpciones(lista);
                                                    } catch (e) {}
                                                }
                                            }}
                                            onChange={(event, nuevoValor) => {
                                                const idSeleccionado = nuevoValor && typeof nuevoValor === 'object' ? nuevoValor.id : '';
                                                formik.setFieldValue('clienteId', idSeleccionado);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} size="small" required fullWidth label="Cliente" InputLabelProps={{ sx: redAsteriskStyle, shrink: true }} error={formik.touched.clienteId && Boolean(formik.errors.clienteId)} helperText={formik.touched.clienteId && formik.errors.clienteId} />
                                            )}
                                            renderOption={(props, opcion) => (
                                                <li {...props} key={opcion.id}>
                                                    {opcion.nombre} {opcion.apellidoPaterno || ''} {opcion.apellidoMaterno || ''}
                                                </li>
                                            )}
                                        />
                                    </Box>
                                    <Box>
                                        <TextField size="small" required select fullWidth id="sucursalId" name="sucursalId" label="Sucursal" value={formik.values.sucursalId} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.sucursalId && Boolean(formik.errors.sucursalId)} helperText={formik.touched.sucursalId && formik.errors.sucursalId} InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}>
                                            {sucursales.map((sucursal) => (
                                                <MenuItem key={sucursal.id} value={sucursal.id}>
                                                    {sucursal.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    <Box>
                                        <TextField size="small" required select fullWidth id="paqueteId" name="paqueteId" label="Paquete" value={formik.values.paqueteId} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.paqueteId && Boolean(formik.errors.paqueteId)} helperText={formik.touched.paqueteId && formik.errors.paqueteId} InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}>
                                            {paquetes.map((paquete) => (
                                                <MenuItem key={paquete.id} value={paquete.id}>
                                                    {paquete.clave} - {paquete.descripcion}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Box>

                                {/* Campo usuario eliminado: se toma de la sesión */}

                            </Paper>
                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Beneficiarios
                                </Typography>

                                {/* Beneficiario 1 */}
                                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                    Beneficiario 1
                                </Typography>
                                <Grid
                                    container
                                    spacing={2}
                                    columns={{ xs: 12, sm: 12, md: 12 }}
                                    sx={{ '& .MuiTextField-root': { width: '100%' }, mb: 2 }}
                                >
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="nombreBeneficiario1"
                                            name="nombreBeneficiario1"
                                            label="Nombre"
                                            value={formik.values.nombreBeneficiario1}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="apellidoPaternoBeneficiario1"
                                            name="apellidoPaternoBeneficiario1"
                                            label="Apellido paterno"
                                            value={formik.values.apellidoPaternoBeneficiario1}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="apellidoMaternoBeneficiario1"
                                            name="apellidoMaternoBeneficiario1"
                                            label="Apellido materno"
                                            value={formik.values.apellidoMaternoBeneficiario1}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Beneficiario 2 */}
                                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                    Beneficiario 2
                                </Typography>
                                <Grid
                                    container
                                    spacing={2}
                                    columns={{ xs: 12, sm: 12, md: 12 }}
                                    sx={{ '& .MuiTextField-root': { width: '100%' }, mb: 2 }}
                                >
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="nombreBeneficiario2"
                                            name="nombreBeneficiario2"
                                            label="Nombre"
                                            value={formik.values.nombreBeneficiario2}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="apellidoPaternoBeneficiario2"
                                            name="apellidoPaternoBeneficiario2"
                                            label="Apellido paterno"
                                            value={formik.values.apellidoPaternoBeneficiario2}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="apellidoMaternoBeneficiario2"
                                            name="apellidoMaternoBeneficiario2"
                                            label="Apellido materno"
                                            value={formik.values.apellidoMaternoBeneficiario2}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Beneficiario 3 */}
                                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                    Beneficiario 3
                                </Typography>
                                <Grid
                                    container
                                    spacing={2}
                                    columns={{ xs: 12, sm: 12, md: 12 }}
                                    sx={{ '& .MuiTextField-root': { width: '100%' } }}
                                >
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="nombreBeneficiario3"
                                            name="nombreBeneficiario3"
                                            label="Nombre"
                                            value={formik.values.nombreBeneficiario3}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="apellidoPaternoBeneficiario3"
                                            name="apellidoPaternoBeneficiario3"
                                            label="Apellido paterno"
                                            value={formik.values.apellidoPaternoBeneficiario3}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={4} md={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="apellidoMaternoBeneficiario3"
                                            name="apellidoMaternoBeneficiario3"
                                            label="Apellido materno"
                                            value={formik.values.apellidoMaternoBeneficiario3}
                                            onChange={formik.handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Divider />
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                <Button
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.values.id ? 'Actualizar' : 'Agregar'}
                                </Button>
                                <Button
                                    color="primary"
                                    startIcon={<RefreshIcon />}
                                    variant="contained"
                                    onClick={handleReset}
                                    disabled={formik.isSubmitting}
                                >
                                    Reiniciar
                                </Button>
                                <Button
                                    color={operacionTerminada ? "primary" : "warning"}
                                    variant="contained"
                                    startIcon={operacionTerminada ? <ExitToAppIcon /> : <CancelIcon />}
                                    onClick={onClose}
                                >
                                    {operacionTerminada ? "Salir" : "Cancelar"}
                                </Button>
                            </Stack>
                        </Box>
                    </LocalizationProvider>
                )}
            </DialogContent>
        </Dialog>
    );
};
