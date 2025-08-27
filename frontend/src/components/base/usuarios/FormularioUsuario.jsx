import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Paper, Stack, Switch, FormControlLabel, Chip } from '@mui/material';
import { actualizarUsuarioApi, crearUsuarioApi, } from "../../api/UsuarioApiService"
import { obtenerRolesApi } from "../../api/RolApiService"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDraggableDialog } from '../common/useDraggableDialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cargando from '../dashboard/elementos/Cargando';
import { useSnackbar } from '../dashboard/elementos/SnackbarContext';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../dashboard/elementos/iconify';
import Grid from '@mui/material/Grid2';

import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText
} from '@mui/material';


export default function FormularioUsuario({ modo, registro, open, onClose, refrescar }) {
	const { addSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState([]);
	const [loadingData, setLoadingData] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open, [loading, loadingData]);

	const formik = useFormik({
		initialValues: {
			id: '',
			nombre: '',
			contrasena: '',
			rolId: '',
			activo: true,
		},
		validationSchema: Yup.object({
			nombre: Yup.string()
				.required('Requerido')
				.max(100, 'Máximo 100 caracteres'),
			contrasena: Yup.string()
				.required('Requerido')
				.min(8, 'La contraseña debe ser de al menos 8 caracteres')
				.max(100, 'Máximo 100 caracteres'),
			rolId: Yup.string()
				.required('Debe seleccionar un rol'),
		}),
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const formData = {
					id: values.id,
					nombre: values.nombre,
					contrasena: values.contrasena,
					activo: values.activo,
					rol: {
						id: values.rolId
					}
				};

				const apiCall = modo === "editar"
					? actualizarUsuarioApi(formData.id, formData)
					: crearUsuarioApi(formData);

				await apiCall;
				
				// Mensaje personalizado según el estado del usuario
				let mensaje = `Usuario ${modo === "editar" ? "actualizado" : "creado"} correctamente`;
				if (modo === "editar" && !values.activo) {
					mensaje += " (Usuario desactivado)";
				}
				
				addSnackbar(mensaje, "success");
				refrescar?.();
				onClose();
			} catch (error) {
				console.error('Error completo:', error);

				// Manejo correcto del error
				let message = "Error inesperado";

				if (error.response?.data) {
					// Si es un objeto de error de Spring Boot
					if (typeof error.response.data === 'object') {
						message = error.response.data.message ||
							error.response.data.error ||
							`Error ${error.response.data.status || 'del servidor'}`;
					} else {
						// Si es un string directo
						message = error.response.data;
					}
				} else if (error.message) {
					message = error.message;
				}

				addSnackbar(message, "error");
			} finally {
				setLoading(false);
			}
		},
	});

	const cargarDatosFormulario = async () => {
		setLoadingData(true);
		try {
			// Cargar todos los roles primero
			const response = await obtenerRolesApi();
			const rolesData = response.data || [];
			setRoles(rolesData);

			// Si es edición y hay registro, configurar el formulario DESPUÉS de cargar roles
			if (modo === "editar" && registro) {
				// Esperar un poco para asegurar que los roles se han establecido en el estado
				await new Promise(resolve => setTimeout(resolve, 100));
				
				// Determinar el rolId correctamente
				let rolId = '';
				if (registro.rol) {
					rolId = String(registro.rol.id || '');
				} else if (registro.rolNombre && rolesData.length > 0) {
					// Si solo tenemos el nombre del rol, buscar el ID
					const rolEncontrado = rolesData.find(r => r.nombre === registro.rolNombre);
					rolId = rolEncontrado ? String(rolEncontrado.id) : '';
				}
				
				// Determinar el estado activo correctamente
				let estadoActivo = true; // valor por defecto
				if (registro.activo !== undefined && registro.activo !== null) {
					estadoActivo = Boolean(registro.activo);
				}
				
				const nuevosValores = {
					id: registro.id || '',
					nombre: registro.nombre || '',
					contrasena: '', // No precargar contraseña por seguridad
					rolId: rolId,
					activo: estadoActivo,
				};
				
				// Estado activo determinado correctamente
				
				formik.setValues(nuevosValores);
			} else {
				formik.resetForm();
			}
		} catch (error) {
			console.error('Error cargando datos:', error);
			addSnackbar('Error cargando roles', 'error');
		} finally {
			setLoadingData(false);
		}
	};

	useEffect(() => {
		if (open) {
			setShowPassword(false);
			cargarDatosFormulario();
		}
	}, [open, modo, registro]);

	// UseEffect adicional para forzar la actualización del campo activo cuando cambie el registro
	useEffect(() => {
		if (open && modo === "editar" && registro && registro.activo !== undefined) {
			const estadoActivo = Boolean(registro.activo);
			if (formik.values.activo !== estadoActivo) {
				// Actualizando estado activo del switch
				formik.setFieldValue('activo', estadoActivo);
			}
		}
	}, [registro?.activo, open, modo]);

	const handleReset = () => {
		formik.resetForm();
	};

	return (
		<Dialog open={open} onClose={onClose} PaperProps={dialogPaperProps}>
			<DialogTitle {...dialogTitleProps} sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2, cursor: 'move' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'inherit' }}>
						{modo === 'editar' ? 'Editar usuario' : 'Crear usuario'}
					</Typography>
					<IconButton onClick={onClose} aria-label="close" sx={{ color: '#fff' }}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>
			<DialogContent>
				{loading || loadingData ? (
					<Cargando loading={loading || loadingData} />
				) : (
					<Box
						component="form"
						onSubmit={formik.handleSubmit}
						sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 450, pt: 1 }}
					>
						<Paper elevation={1} sx={{ p: 1, mb: 1 }}>
							<Stack direction="column" spacing={1}>
								<TextField
									size="small"
									required
									fullWidth
									name="nombre"
									label="Nombre"
									value={formik.values.nombre}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.nombre && Boolean(formik.errors.nombre)}
									helperText={formik.touched.nombre && formik.errors.nombre}
									autoFocus
								/>
								<TextField
									size="small"
									required
									fullWidth
									name="contrasena"
									label="Contraseña"
									type={showPassword ? 'text' : 'password'}
									value={formik.values.contrasena}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.contrasena && Boolean(formik.errors.contrasena)}
									helperText={formik.touched.contrasena && formik.errors.contrasena}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
													<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<FormControl
									size="small"
									required
									fullWidth
									error={formik.touched.rolId && Boolean(formik.errors.rolId)}
								>
									<InputLabel>Rol</InputLabel>
									<Select
										name="rolId"
										value={formik.values.rolId || ''}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										label="Rol"
									>
										{roles.map((rol) => (
											<MenuItem key={rol.id} value={String(rol.id)}>
												{rol.nombre}
											</MenuItem>
										))}
									</Select>
									{formik.touched.rolId && formik.errors.rolId && (
										<FormHelperText>{formik.errors.rolId}</FormHelperText>
									)}
								</FormControl>

								{/* Campo para activar/desactivar usuario (soft delete) */}
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
									<FormControlLabel
										control={
											<Switch
												checked={Boolean(formik.values.activo)}
												onChange={(e) => {
													formik.setFieldValue('activo', e.target.checked);
												}}
												name="activo"
												color="primary"
											/>
										}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<Typography variant="body2">
													Estado del usuario
												</Typography>
																												<Chip
																	label={Boolean(formik.values.activo) ? 'Activo' : 'Inactivo'}
																	color={Boolean(formik.values.activo) ? 'success' : 'error'}
																	size="small"
																	variant="outlined"
																/>
											</Box>
										}
									/>
								</Box>
								{!Boolean(formik.values.activo) && (
									<Typography variant="caption" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
										⚠️ Usuario inactivo: No podrá iniciar sesión en el sistema
									</Typography>
								)}
							</Stack>
						</Paper>
						<Paper elevation={1} sx={{ p: 1, mb: 1 }}>
							<Stack direction="row" spacing={1}>
								<Button variant="contained" type="submit" disabled={formik.isSubmitting} startIcon={<SaveIcon />}>
									{modo === 'editar' ? 'Actualizar' : 'Agregar'}
								</Button>
								<Button variant="contained" onClick={handleReset} disabled={formik.isSubmitting} startIcon={<RefreshIcon />}>Reiniciar</Button>
								<Button color="warning" variant="contained" onClick={onClose} startIcon={<CancelIcon />}>Cancelar</Button>
							</Stack>
						</Paper>
					</Box>
				)}
			</DialogContent>
		</Dialog>
	);
}