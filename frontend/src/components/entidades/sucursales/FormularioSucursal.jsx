import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { actualizarSucursalApi, crearSucursalApi, } from '../../api/SucursalApiService';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDraggableDialog } from '../../base/common/useDraggableDialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cargando from '../../base/dashboard/elementos/Cargando';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
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

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#1890ff',
                ...theme.applyStyles('dark', {
                    backgroundColor: '#177ddc',
                }),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
        ...theme.applyStyles('dark', {
            backgroundColor: 'rgba(255,255,255,.35)',
        }),
    },
}));

export default function FormularioSucursal({ modo, registro, open, onClose, refrescar }) {
    const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open);

    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("America/Mexico_City");

    const initialValues = {
        id: '',
        nombre: '',
    };

    const validationSchema = Yup.object({
        nombre: Yup.string().required('Requerido'),
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
                };

                const response = (modo === "editar" ? actualizarSucursalApi(formData.id, formData) : crearSucursalApi(formData))
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
                console.log(`Error inesperado ${values.id ? ' actualizando' : ' creando'} sucursal: ${err.message}`, "error");
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

    const nombreRef = useRef();

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus(); // Focus the next input if it exists
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={dialogPaperProps}>
            <DialogTitle {...dialogTitleProps} sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2, cursor: 'move' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        {modo === 'editar' ? 'Editar sucursal' : 'Crear sucursal'}
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '450px', margin: 'auto', mt: 1 }}
                    >
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
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
                                        onKeyDown={(e) => handleKeyDown(e, null)}
                                        inputRef={nombreRef}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
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
                )}
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
};

