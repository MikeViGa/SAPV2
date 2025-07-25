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

    // Define empty initial values for create mode
    const emptyValues = {
        id: '',
        nombreUsuario: '',
        contrasena: '',
    };

    // Get initial values based on mode
    const getInitialValues = () => {
        if (modo === 'crear') {
            return emptyValues;
        } else if (modo === 'editar' && registro) {
            let fechaCreacion;
            try {
                fechaCreacion = parse(registro.fechaCreacion, 'dd/MM/yyyy HH:mm:ss', new Date());
            } catch (error) {
                console.error("Error parsing date:", error);
                fechaCreacion = new Date();
            }
            
            return {
                id: registro.id || '',
                nombreUsuario: registro.nombreUsuario || '',
                contrasena: registro.contrasena || '',
                fechaCreacion: fechaCreacion,
                estado: registro.estado || 'Activo',
            };
        }
        return emptyValues;
    };

    const validationSchema = useMemo(() => Yup.object({
        nombreUsuario: Yup.string().required('Requerido'),
        contrasena: Yup.string().min(8, 'La contraseña debe ser de al menos 8 caracteres').required('Requerido'),
        ...(modo === 'editar' && {
            fechaCreacion: Yup.date().required('Requerido'),
            estado: Yup.string().required('Requerido'),
        })
    }), [modo]);

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: false, // Change this to false
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setLoading(true);
                let formData = {
                    id: values.id,
                    nombreUsuario: values.nombreUsuario,
                    contrasena: values.contrasena,
                };

                // Solo incluir estos campos si estamos editando
                if (modo === 'editar') {
                    formData.fechaCreacion = format(values.fechaCreacion, 'dd/MM/yyyy HH:mm:ss');
                    formData.estado = values.estado;
                }

                const response = (modo === "editar" ? actualizarUsuarioApi(formData.id, formData) : crearUsuarioApi(formData))
                    .then(response => {
                        addSnackbar("Registro " + (modo === "editar" ? "actualizado" : "creado") + " correctamente", "success");
                        setOperacionTerminada(true);
                    }).catch(error => {
                        let errorMessage = "Error inesperado";
                        if (error.response) {
                        // Si hay un mensaje específico en la respuesta
                        if (error.response.data?.message) {
                            errorMessage = error.response.data.message;
                        } else if (typeof error.response.data === 'string') {
                            errorMessage = error.response.data;
                        } else {
                            errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
                        }
                    } else if (error.request) {
                        errorMessage = "Error de conexión con el servidor";
                    } else {
                        errorMessage = error.message || "Error inesperado";
                    }
                    addSnackbar(errorMessage, "error");
                    });
            } catch (err) {
                console.log(`Error inesperado ${values.id ? ' actualizando' : ' creando'} usuario: ${err.message}`, "error");
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    // Main effect to handle form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            // Reset component state
            setOperacionTerminada(false);
            setLoading(false);
            setShowPassword(false);
            
            // Force reset form values
            if (modo === 'crear') {
                // For create mode, always use empty values
                formik.setValues(emptyValues);
                formik.setErrors({});
                formik.setTouched({});
            } else if (modo === 'editar' && registro) {
                // For edit mode, set the registro values
                let fechaCreacion;
                try {
                    fechaCreacion = parse(registro.fechaCreacion, 'dd/MM/yyyy HH:mm:ss', new Date());
                } catch (error) {
                    console.error("Error parsing date:", error);
                    fechaCreacion = new Date();
                }
                
                formik.setValues({
                    id: registro.id || '',
                    nombreUsuario: registro.nombreUsuario || '',
                    contrasena: registro.contrasena || '',
                    fechaCreacion: fechaCreacion,
                    estado: registro.estado || 'Activo',
                });
                formik.setErrors({});
                formik.setTouched({});
            }
        } else {
            // When dialog closes, reset everything
            formik.resetForm({
                values: emptyValues,
                errors: {},
                touched: {}
            });
        }
    }, [open, modo]); // Remove registro from dependencies to avoid unnecessary re-renders

    const handleReset = () => {
        if (modo === 'crear') {
            formik.setValues(emptyValues);
            formik.setErrors({});
            formik.setTouched({});
        } else {
            formik.resetForm({
                values: getInitialValues()
            });
        }
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
                            label="Nombre"
                            value={formik.values.nombreUsuario || ''} // Add || '' to ensure empty string
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
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.contrasena || ''} // Add || '' to ensure empty string
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
                            onKeyDown={(e) => handleKeyDown(e, modo === 'editar' ? fechaCreacionRef : null)}
                            inputRef={contrasenaRef}
                        />

                        {/* Campo fecha de creación - solo en edición */}
                        {modo === 'editar' && formik.values.fechaCreacion && (
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} localeText={localeText}>
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
                        )}

                        {/* Campo estado - solo en edición */}
                        {modo === 'editar' && (
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <Typography>Cancelado</Typography>
                                <AntSwitch
                                    checked={formik.values.estado === 'Activo'}
                                    onChange={(event) => {
                                        formik.setFieldValue('estado', event.target.checked ? 'Activo' : 'Cancelado');
                                    }}
                                    inputRef={estadoRef}
                                />
                                <Typography>Activo</Typography>
                            </Stack>
                        )}

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