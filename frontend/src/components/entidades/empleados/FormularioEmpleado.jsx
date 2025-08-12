import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, } from '@mui/material';
import { actualizarEmpleadoApi, crearEmpleadoApi, } from "../../api/EmpleadoApiService";
import { obtenerUsuarioNombreApi } from "../../api/UsuarioApiService";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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
import Stack from '@mui/material/Stack';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import { Autocomplete } from '@mui/material';

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

export default function FormularioEmpleado({ modo, registro, open, onClose, refrescar }) {

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
        correo: '',
        telefono: '',
        fechaNacimiento: '',
        fechaAlta: '',
        estado: '',
        nombreUsuario: '',
    };

    const validationSchema = Yup.object({
        nombre: Yup.string().required('Requerido'),
        apellidoPaterno: Yup.string().required('Requerido'),
        apellidoMaterno: Yup.string().required('Requerido'),
        correo: Yup.string().email('Correo no válido').required('Requerido'),
        telefono: Yup.string().matches(/^\d+$/, 'Debe ser un número teléfonico válido').required('Requerido'),
        fechaNacimiento: Yup.date().required('Requerido'),
        fechaAlta: Yup.date()
            .transform((value, originalValue) => {
                return originalValue ? dayjs(originalValue).toDate() : null;
            })
            .typeError('Fecha inválida')
            .required('Requerido'),
        estado: Yup.string().required('Requerido'),
        nombreUsuario: Yup.string().required('Requerido'),
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
                    correo: values.correo,
                    telefono: values.telefono,
                    fechaNacimiento: values.fechaNacimiento,
                    fechaAlta: values.fechaAlta,
                    estado: values.estado,
                    nombreUsuario: values.nombreUsuario,
                };
                const response = (modo === "editar" ? actualizarEmpleadoApi(formData.id, formData) : crearEmpleadoApi(formData))
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
                formik.setValues({
                    ...registro,
                    fechaCreacion: dayjs(registro.fechaCreacion),
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
    const apellidoPaternoRef = useRef();
    const apellidoMaternoRef = useRef();
    const correoRef = useRef();
    const telefonoRef = useRef();
    const fechaNacimientoRef = useRef();
    const fechaAltaRef = useRef();
    const estadoRef = useRef();
    const nombreUsuarioRef = useRef();

    const handleKeyDown = (event, nextRef) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus(); // Focus the next input if it exists
            }
        }
    };

    const [idRegistro, setIdRegistro] = useState(null);
    const [opciones, setOpciones] = useState([]);

    function obtenerOpciones(consulta) {
        obtenerUsuarioNombreApi(consulta)  //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
            .then(respuesta => {
                setOpciones(respuesta.data);
            }).catch(error => {
                console.error("Error obteniendo registros:", error);
            });
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: 'inherit' }}>
                        {modo === 'editar' ? 'Editar empleado' : 'Crear empleado'}
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '400px', margin: 'auto', mt: 0 }}
                    >
                        <Typography variant="h5" component="h1" gutterBottom>
                            {modo === 'editar' ? 'Editar empleado' : 'Crear empleado'}
                        </Typography>
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
                            inputRef={nombreRef}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, apellidoPaternoRef)}
                        />
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
                            inputRef={apellidoPaternoRef}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, apellidoMaternoRef)}
                        />
                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="apellidoMaterno"
                            name="apellidoMaterno"
                            label="Apellido materno"
                            value={formik.values.apellidoMaterno}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.apellidoMaterno && Boolean(formik.errors.apellidoMaterno)}
                            helperText={formik.touched.apellidoMaterno && formik.errors.apellidoMaterno}
                            inputRef={apellidoMaternoRef}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, correoRef)}
                        />
                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="correo"
                            name="correo"
                            label="Correo"
                            value={formik.values.correo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.correo && Boolean(formik.errors.correo)}
                            helperText={formik.touched.correo && formik.errors.correo}
                            inputRef={correoRef}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, telefonoRef)}
                        />
                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="telefono"
                            name="telefono"
                            label="Teléfono"
                            value={formik.values.telefono}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                            helperText={formik.touched.telefono && formik.errors.telefono}
                            inputRef={telefonoRef}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, fechaNacimientoRef)}
                        />
                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            label="Fecha de nacimiento"
                            type="date"
                            value={formik.values.fechaNacimiento}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fechaNacimiento && Boolean(formik.errors.fechaNacimiento)}
                            helperText={formik.touched.fechaNacimiento && formik.errors.fechaNacimiento}
                            inputRef={fechaNacimientoRef}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, fechaAltaRef)}
                        />
                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="fechaAlta"
                            name="fechaAlta"
                            label="Fecha de alta"
                            type="date"
                            value={formik.values.fechaAlta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fechaAlta && Boolean(formik.errors.fechaAlta)}
                            helperText={formik.touched.fechaAlta && formik.errors.fechaAlta}
                            inputRef={fechaAltaRef}
                            InputLabelProps={{
                                sx: redAsteriskStyle,
                                shrink: true,
                            }}
                            onKeyDown={(e) => handleKeyDown(e, estadoRef)}
                        />
                        <Autocomplete
                            freeSolo
                            options={opciones}
                            value={formik.values.nombreUsuario}
                            getOptionLabel={(opcion) =>
                                typeof opcion === 'string' ? opcion : `${opcion.nombre} (ID: ${opcion.id})` //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
                            }
                            onInputChange={(event, nuevoValor) => {
                                if (nuevoValor.length >= 3) {
                                    obtenerOpciones(nuevoValor);
                                } else {
                                    setOpciones([]);
                                }
                            }}
                            onChange={(event, nuevoValor) => {
                                if (nuevoValor && typeof nuevoValor === 'object') {
                                    setIdRegistro(nuevoValor.id);
                                } else {
                                    setIdRegistro(null);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Usuario"
                                    fullWidth
                                    required
                                    style={{ width: '400px' }}
                                    size="small"
                                    InputLabelProps={{
                                        sx: redAsteriskStyle,
                                        shrink: true,
                                    }}
                                />
                            )}
                            renderOption={(props, opcion) => {
                                const { key, ...otherProps } = props; // Extract the key from props
                                return (
                                    <li key={key} {...otherProps}>
                                        {opcion.nombre} (ID: {opcion.id})
                                    </li>
                                );
                            }}
                            inputRef={nombreUsuarioRef}
                        />
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Typography>Cancelado</Typography>
                            <AntSwitch
                                checked={formik.values.estado === 'Activo'}
                                onChange={(event) => {
                                    formik.setFieldValue('estado', event.target.checked ? 'Activo' : 'Cancelado');
                                }}
                                inputRef={fechaAltaRef}
                                onKeyDown={(e) => handleKeyDown(e, null)}
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