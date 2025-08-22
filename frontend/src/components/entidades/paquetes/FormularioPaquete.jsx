import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, MenuItem, Paper } from '@mui/material';
import { actualizarPaqueteApi, crearPaqueteApi, obtenerPaqueteApi } from '../../api/PaqueteApiService';
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
import { Divider } from '@mui/material';
import { Stack } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { obtenerPlazosDePagoApi } from '../../api/PlazosDePagoApiService';
import { obtenerPeriodicidadesApi } from '../../api/PeriodicidadApiService';
import { obtenerListasDePreciosApi } from '../../api/ListaDePreciosApiService';

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

export default function FormularioPaquete({ modo, registro, open, onClose, refrescar }) {

  const { addSnackbar } = useSnackbar();
  const [operacionTerminada, setOperacionTerminada] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catalogoPlazos, setCatalogoPlazos] = useState([]);
  const [catalogoListas, setCatalogoListas] = useState([]);
  const [catalogoPeriodicidades, setCatalogoPeriodicidades] = useState([]);

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("America/Mexico_City");

  const initialValues = {
    id: '',
    clave: '',
    servicios: '',
    numeroPagos: '',
    valorTotal: '',
    enganche: '',
    importe: '',
    bovedas: '',
    gavetas: '',
    plazoDePagoId: '',
    listaDePreciosId: '',
    periodicidadId: '',
  };

  const validationSchema = Yup.object({
    clave: Yup.string().required('Requerido'),
    servicios: Yup.number().typeError('Numérico').required('Requerido'),
    numeroPagos: Yup.number().typeError('Numérico').required('Requerido'),
    valorTotal: Yup.number().typeError('Numérico').required('Requerido'),
    enganche: Yup.number().typeError('Numérico').required('Requerido'),
    importe: Yup.number().typeError('Numérico').required('Requerido'),
    bovedas: Yup.number().typeError('Numérico').required('Requerido'),
    gavetas: Yup.number().typeError('Numérico').required('Requerido'),
    plazoDePagoId: Yup.number().typeError('Seleccione un valor').required('Requerido'),
    listaDePreciosId: Yup.number().typeError('Seleccione un valor').required('Requerido'),
    periodicidadId: Yup.number().typeError('Seleccione un valor').required('Requerido'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        let formData = {
          id: values.id,
          clave: values.clave,
          servicios: Number(values.servicios),
          numeroPagos: Number(values.numeroPagos),
          valorTotal: Number(values.valorTotal),
          enganche: Number(values.enganche),
          importe: Number(values.importe),
          bovedas: Number(values.bovedas),
          gavetas: Number(values.gavetas),
          plazoDePago: values.plazoDePagoId ? { id: Number(values.plazoDePagoId) } : null,
          listaDePrecios: values.listaDePreciosId ? { id: Number(values.listaDePreciosId) } : null,
          periodicidad: values.periodicidadId ? { id: Number(values.periodicidadId) } : null,
        };

        const response = (modo === "editar" ? actualizarPaqueteApi(formData.id, formData) : crearPaqueteApi(formData))
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
        console.log(`Error inesperado ${values.id ? ' actualizando' : ' creando'} paquete: ${err.message}`, "error");
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!open) return;

    // Resetear formulario si es crear
    if (modo === 'crear') {
      formik.resetForm({ values: initialValues });
    }

    // Cargar catálogos
    (async () => {
      try {
        const [plazos, listas, periodicidades] = await Promise.all([
          obtenerPlazosDePagoApi(),
          obtenerListasDePreciosApi(),
          obtenerPeriodicidadesApi(),
        ]);


        const catalogoPlazosActualizado = plazos?.data || [];
        const catalogoListasActualizado = listas?.data || [];
        const catalogoPeriodicidadesActualizado = periodicidades?.data || [];

        // Actualizar estados de catálogos
        setCatalogoPlazos(catalogoPlazosActualizado);
        setCatalogoListas(catalogoListasActualizado);
        setCatalogoPeriodicidades(catalogoPeriodicidadesActualizado);

        // Si es modo editar, cargar datos del paquete
        if (modo === 'editar' && registro?.id) {
          const resp = await obtenerPaqueteApi(registro.id);
          const det = typeof resp.data === 'string' ? JSON.parse(resp.data) : resp.data;

          if (det) {
            // Esperar un tick para que los estados se actualicen
            setTimeout(() => {
              const valoresFormulario = {
                id: det.id || '',
                clave: det.clave || '',
                servicios: det.servicios || '',
                numeroPagos: det.numeroPagos || '',
                valorTotal: det.valorTotal || '',
                enganche: det.enganche || '',
                importe: det.importe || '',
                bovedas: det.bovedas || '',
                gavetas: det.gavetas || '',
                plazoDePagoId: det.plazoDePago?.id || '',
                listaDePreciosId: det.listaDePrecios?.id || '',
                periodicidadId: det.periodicidad?.id || '',
              };

              formik.setValues(valoresFormulario);
            }, 100);
          }
        }
      } catch (e) {
        console.error('Error cargando datos:', e);
      }
    })();
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

  const claveRef = useRef();
  // Draggable dialog state/refs
  const { paperProps: dialogPaperProps, titleProps: dialogTitleProps } = useDraggableDialog(open);

  const handleKeyDown = (event, nextRef) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus(); // Focus the next input if it exists
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="lg" PaperProps={dialogPaperProps}>
      <DialogTitle {...dialogTitleProps} sx={{ bgcolor: '#1976d2', color: '#fff', py: 1, px: 2, cursor: 'move' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: 'inherit' }}>
            {modo === 'editar' ? 'Editar paquete' : 'Crear paquete'}
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
            sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 1200, margin: 'auto', mt: 1 }}
          >
            <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1, '& .MuiTextField-root': { width: '100%' } }}>
                <Box>
                  <TextField size="small" required fullWidth id="clave" name="clave" label="Clave"
                    value={formik.values.clave}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.clave && Boolean(formik.errors.clave)}
                    helperText={formik.touched.clave && formik.errors.clave}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                    inputRef={claveRef}

                  />
                </Box>
                <Box>
                  <TextField size="small" required fullWidth id="servicios" name="servicios" label="Servicios"
                    value={formik.values.servicios}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.servicios && Boolean(formik.errors.servicios)}
                    helperText={formik.touched.servicios && formik.errors.servicios}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}

                  />
                </Box>
                <Box>
                  <TextField size="small" required fullWidth id="numeroPagos" name="numeroPagos" label="Número de pagos"
                    value={formik.values.numeroPagos}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.numeroPagos && Boolean(formik.errors.numeroPagos)}
                    helperText={formik.touched.numeroPagos && formik.errors.numeroPagos}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                  />
                </Box>
                <Box>
                  <TextField size="small" required fullWidth id="valorTotal" name="valorTotal" label="Valor total"
                    value={formik.values.valorTotal}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.valorTotal && Boolean(formik.errors.valorTotal)}
                    helperText={formik.touched.valorTotal && formik.errors.valorTotal}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                  />
                </Box>
                <Box>
                  <TextField size="small" required fullWidth id="enganche" name="enganche" label="Enganche"
                    value={formik.values.enganche}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.enganche && Boolean(formik.errors.enganche)}
                    helperText={formik.touched.enganche && formik.errors.enganche}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                  />
                </Box>
                <Box>
                  <TextField size="small" required fullWidth id="importe" name="importe" label="Importe"
                    value={formik.values.importe}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.importe && Boolean(formik.errors.importe)}
                    helperText={formik.touched.importe && formik.errors.importe}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                  />
                </Box>
                <Box>
                  <TextField size="small" required fullWidth id="bovedas" name="bovedas" label="Bóvedas"
                    value={formik.values.bovedas}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bovedas && Boolean(formik.errors.bovedas)}
                    helperText={formik.touched.bovedas && formik.errors.bovedas}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                  />
                </Box>
                <Box>
                  <TextField size="small" required fullWidth id="gavetas" name="gavetas" label="Gavetas"
                    value={formik.values.gavetas}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.gavetas && Boolean(formik.errors.gavetas)}
                    helperText={formik.touched.gavetas && formik.errors.gavetas}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                  />
                </Box>
                <Box>
                  <TextField select size="small" required fullWidth id="plazoDePagoId" name="plazoDePagoId" label="Plazo de pago"
                    value={formik.values.plazoDePagoId === null ? '' : formik.values.plazoDePagoId}
                    onChange={(e) => {
                      formik.setFieldValue('plazoDePagoId', e.target.value === '' ? '' : Number(e.target.value));
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.plazoDePagoId && Boolean(formik.errors.plazoDePagoId)}
                    helperText={formik.touched.plazoDePagoId && formik.errors.plazoDePagoId}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                  >
                    {(catalogoPlazos || []).map((p) => {
                      return <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>;
                    })}
                  </TextField>
                </Box>
                <Box>
                  <TextField select size="small" required fullWidth id="listaDePreciosId" name="listaDePreciosId" label="Lista de precios"
                    value={formik.values.listaDePreciosId === null ? '' : formik.values.listaDePreciosId}
                    onChange={(e) => {
                      formik.setFieldValue('listaDePreciosId', e.target.value === '' ? '' : Number(e.target.value));
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.listaDePreciosId && Boolean(formik.errors.listaDePreciosId)}
                    helperText={formik.touched.listaDePreciosId && formik.errors.listaDePreciosId}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                  >
                    {(catalogoListas || []).map((l) => {

                      return <MenuItem key={l.id} value={l.id}>{l.nombre}</MenuItem>;
                    })}
                  </TextField>
                </Box>
                <Box>
                  <TextField select size="small" required fullWidth id="periodicidadId" name="periodicidadId" label="Periodicidad"
                    value={formik.values.periodicidadId === null ? '' : formik.values.periodicidadId}
                    onChange={(e) => {
                      formik.setFieldValue('periodicidadId', e.target.value === '' ? '' : Number(e.target.value));
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.periodicidadId && Boolean(formik.errors.periodicidadId)}
                    helperText={formik.touched.periodicidadId && formik.errors.periodicidadId}
                    InputLabelProps={{ sx: redAsteriskStyle, shrink: true }}
                  >
                    {(catalogoPeriodicidades || []).map((pd) => {
                      return <MenuItem key={pd.id} value={pd.id}>{pd.nombre}</MenuItem>;
                    })}
                  </TextField>
                </Box>
              </Box>
            </Paper>
            <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
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