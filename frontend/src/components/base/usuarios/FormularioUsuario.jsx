import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, } from '@mui/material';
import { actualizarUsuarioApi, crearUsuarioApi, } from "../../api/UsuarioApiService"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cargando from '../dashboard/elementos/Cargando';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { useSnackbar } from '../dashboard/elementos/SnackbarContext';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Iconify from '../dashboard/elementos/iconify';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';

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

export default function FormularioUsuario({ modo, registro, open, onClose, refrescar }) {

    const { addSnackbar } = useSnackbar();
    const [operacionTerminada, setOperacionTerminada] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = useMemo(() => ({
        id: '',
        nombreUsuario: '',
        contrasena: '',
        fechaCreacion: new Date(),
        estado: 'Activo',
    }), []);

    const validationSchema = Yup.object({
        nombreUsuario: Yup.string().required('Requerido'),
        contrasena: Yup.string().min(8, 'La contraseña debe ser de al menos 8 caracteres').required('Requerido'),
        fechaCreacion: Yup.date().required('Requerido'),
        estado: Yup.string().required('Requerido'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setLoading(true);
                let formData = {
                    id: values.id,
                    nombreUsuario: values.nombreUsuario,
                    contrasena: values.contrasena,
                    fechaCreacion: format(values.fechaCreacion, 'dd/MM/yyyy HH:mm:ss'),
                    estado: values.estado,
                };

                const response = (modo === "editar" ? actualizarUsuarioApi(formData.id, formData) : crearUsuarioApi(formData))
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
                console.log(`Error inesperado ${values.id ? ' actualizando' : ' creando'} usuario: ${err.message}`, "error");
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (open) {
            if (modo === "editar" && registro) {
                let fechaCreacion;
                try {
                    fechaCreacion = parse(registro.fechaCreacion, 'dd/MM/yyyy HH:mm:ss', new Date());
                } catch (error) {
                    console.error("Error parsing date:", error);
                    fechaCreacion = new Date();
                }

                formik.setValues({
                    ...registro,
                    fechaCreacion: fechaCreacion,
                });
            } else {
                formik.setValues({
                    ...initialValues,
                    fechaCreacion: new Date(),
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

    const nombreUsuarioRef = useRef();
    const contrasenaRef = useRef();
    const fechaCreacionRef = useRef();
    const estadoRef = useRef();

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const localeText = {
        // DatePicker texts
        okButtonLabel: 'Aceptar',
        cancelButtonLabel: 'Cancelar',
        clearButtonLabel: 'Limpiar',
        todayButtonLabel: 'Hoy',
        
        // DateTimePicker specific texts
        dateTimePickerToolbarTitle: 'Seleccionar fecha y hora',
        datePickerToolbarTitle: 'Seleccionar fecha',
        timePickerToolbarTitle: 'Seleccionar hora',
        
        // Calendar navigation
        previousMonth: 'Mes anterior',
        nextMonth: 'Mes siguiente',
        
       
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '400px', margin: 'auto', mt: 0 }}
                    >
                        <Typography variant="h5" component="h1" gutterBottom>
                            {modo === 'editar' ? 'Editar usuario' : 'Crear usuario'}
                        </Typography>
                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="nombreUsuario"
                            name="nombreUsuario"
                            label="Nombre de usuario"
                            value={formik.values.nombreUsuario}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nombreUsuario && Boolean(formik.errors.nombreUsuario)}
                            helperText={formik.touched.nombreUsuario && formik.errors.nombreUsuario}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, contrasenaRef)}
                            inputRef={nombreUsuarioRef}
                        />
                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="contrasena"
                            name="contrasena"
                            label="Contraseña"
                            type="password"
                            value={formik.values.contrasena}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.contrasena && Boolean(formik.errors.contrasena)}
                            helperText={formik.touched.contrasena && formik.errors.contrasena}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            onKeyDown={(e) => handleKeyDown(e, fechaCreacionRef)}
                            inputRef={contrasenaRef}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} localeText={localeText} >
                            <DateTimePicker
                                label="Fecha de creación"
                                value={formik.values.fechaCreacion}
                                onChange={(newValue) => {
                                    formik.setFieldValue('fechaCreacion', newValue);
                                }}
                                format="dd/MM/yyyy HH:mm:ss"
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                        error: formik.touched.fechaCreacion && Boolean(formik.errors.fechaCreacion),
                                        helperText: formik.touched.fechaCreacion && formik.errors.fechaCreacion,
                                        InputLabelProps: {
                                            sx: redAsteriskStyle,
                                            shrink: true,
                                        },
                                        onKeyDown: (e) => handleKeyDown(e, estadoRef),
                                        inputRef: fechaCreacionRef,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Typography>Cancelado</Typography>
                            <AntSwitch
                                checked={formik.values.estado === 'Activo'}
                                onChange={(event) => {
                                    formik.setFieldValue('estado', event.target.checked ? 'Activo' : 'Cancelado');
                                }}
                            />
                            <Typography>Activo</Typography>
                        </Stack>
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
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
};