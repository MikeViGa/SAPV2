import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Divider, Stack, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FeedIcon from '@mui/icons-material/Feed';
import { generarReporteClientesPorColoniaApi, obtenerColoniasClienteApi, generarReporteClientesPorFechasApi } from '../../api/ClienteApiService';
import Cargando from '../../base/dashboard/elementos/Cargando';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';

export default function FormularioReportesCliente({ open, onClose }) {
    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);
    const [opciones, setOpciones] = useState([]);
    const [coloniaInput, setColoniaInput] = useState('');
    const fechaInicialRef = useRef();
    const fechaFinalRef = useRef();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("America/Mexico_City");

    const formik = useFormik({
        initialValues: {
            fechaInicial: dayjs().startOf('day'),
            fechaFinal: dayjs().startOf('day'),
            colonia: '',
        },
        validationSchema: Yup.object({
            fechaInicial: Yup.date().required('Fecha inicial es requerida'),
            fechaFinal: Yup.date().required('Fecha final es requerida'),
            colonia: Yup.string(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(false);
        },
    });

    const handleError = (error) => {
        if (error.response) {
            addSnackbar(error.response.data, "error");
        } else if (error.request) {
            addSnackbar("Error en la petición: " + error.request.data, "error");
        } else {
            addSnackbar("Error inesperado: " + error.message, "error");
        }
    };

    const formatDate = (date) => dayjs.utc(date).local().format('DD/MM/YYYY HH:mm:ss');

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Enter' && nextRef?.current) {
            event.preventDefault();
            nextRef.current.focus();
        }
    };

    const handleDateSubmit = async () => {
        try {
            if (!formik.values.fechaInicial || !formik.values.fechaFinal) {
                addSnackbar("Ambas fechas son requeridas", "error");
                return;
            }
            setLoading(true);
            const fechaInicial = formatDate(formik.values.fechaInicial);
            const fechaFinal = formatDate(formik.values.fechaFinal);
            const respuesta = await generarReporteClientesPorFechasApi(fechaInicial, fechaFinal);
            const blob = new Blob([respuesta.data], { type: 'application/pdf' });
            const fileNameMatch = respuesta.headers.get('content-disposition')?.match(/filename\*?=['"]?(?:UTF-\d+'[^;]+|([^;]+))['"]?/i);
            saveAs(blob, fileNameMatch?.[1] || 'reporte-clientes.pdf');
            addSnackbar("Reporte generado correctamente", "success");
            setOperacionTerminada(true);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleColoniaSubmit = async () => {
        try {
            if (!formik.values.colonia) {
                addSnackbar("Colonia es requerida", "error");
                return;
            }
            setLoading(true);
            const respuesta = await generarReporteClientesPorColoniaApi(formik.values.colonia);
            const blob = new Blob([respuesta.data], { type: 'application/pdf' });
            const fileNameMatch = respuesta.headers.get('content-disposition')?.match(/filename\*?=['"]?(?:UTF-\d+'[^;]+|([^;]+))['"]?/i);
            saveAs(blob, fileNameMatch?.[1] || 'reporte-clientes.pdf');
            addSnackbar("Reporte generado correctamente", "success");
            setOperacionTerminada(true);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        formik.resetForm();
        setOperacionTerminada(false);
    };

    const buscarColonias = async (consulta) => {
        if (consulta?.length >= 3) {
            try {
                const respuesta = await obtenerColoniasClienteApi(consulta);
                setOpciones(respuesta.data || []);
            } catch (error) {
                addSnackbar("Error al obtener colonias", "error");
            }
        } else {
            setOpciones([]);
        }
    };

    const dateTimePickerProps = {
        format: "DD/MM/YYYY HH:mm:ss",
        viewRenderers: {
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
        },
    };

    const textFieldProps = {
        size: "small",
        InputLabelProps: {
            sx: { '& .MuiInputLabel-asterisk': { color: 'red' } },
            shrink: true,
        },
    };

    const renderDateTimePicker = (fieldName, label, ref, nextRef) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                {...dateTimePickerProps}
                id={fieldName}
                name={fieldName}
                label={label}
                required
                value={formik.values[fieldName]}
                onChange={(newValue) => formik.setFieldValue(fieldName, newValue)}
                slotProps={{
                    textField: {
                        ...textFieldProps,
                        name: fieldName,
                        onBlur: formik.handleBlur,
                        error: formik.touched[fieldName] && Boolean(formik.errors[fieldName]),
                        helperText: formik.touched[fieldName] && formik.errors[fieldName],
                        onKeyDown: (e) => handleKeyDown(e, nextRef),
                        inputRef: ref,
                    },
                }}
            />
        </LocalizationProvider>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        Reportes de clientes
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
                    <Box component="form" noValidate sx={{ width: '950px', margin: 'auto', mt: 2 }}>
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Typography>Por fechas:</Typography>
                                <Grid xs={12} sm={4}>
                                    {renderDateTimePicker('fechaInicial', 'Fecha inicial', fechaInicialRef, fechaFinalRef)}
                                </Grid>
                                <Grid xs={12} sm={4}>
                                    {renderDateTimePicker('fechaFinal', 'Fecha final', fechaFinalRef, null)}
                                </Grid>
                                <Grid>
                                    <Button
                                        color="primary"
                                        startIcon={<FeedIcon />}
                                        variant="contained"
                                        onClick={handleDateSubmit}
                                        disabled={formik.isSubmitting}
                                    >
                                        Generar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Typography>Por colonia:</Typography>
                                <Grid xs={12} sm={6}>
                                    <Autocomplete
                                        freeSolo
                                        options={opciones}
                                        value={formik.values.colonia || ''}
                                        inputValue={coloniaInput}
                                        onInputChange={(_, newInputValue) => {
                                            setColoniaInput(newInputValue || '');
                                            formik.setFieldValue('colonia', newInputValue || '');
                                            buscarColonias(newInputValue || '');
                                        }}
                                        onChange={(_, newValue) => {
                                            const seleccion = typeof newValue === 'string' ? newValue : (newValue || '');
                                            formik.setFieldValue('colonia', seleccion);
                                            setColoniaInput(seleccion);
                                        }}
                                        getOptionLabel={(opcion) => (typeof opcion === 'string' ? opcion : `${opcion}`)}
                                        isOptionEqualToValue={(option, value) => option === value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Colonia"
                                                style={{ width: '400px' }}
                                                required
                                                size="small"
                                                InputLabelProps={{
                                                    sx: { '& .MuiInputLabel-asterisk': { color: 'red' } },
                                                    shrink: true,
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <Button
                                        color="primary"
                                        startIcon={<FeedIcon />}
                                        variant="contained"
                                        onClick={handleColoniaSubmit}
                                        disabled={formik.isSubmitting}
                                    >
                                        Generar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                        </Paper>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
}