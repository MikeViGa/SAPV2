import { useState } from "react";
import { eliminarOperacionApi, obtenerReporteOperacionApi } from "../../api/OperacionApiService";
import { Button, Box, IconButton, Typography } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import FeedIcon from '@mui/icons-material/Feed';
import { GridToolbarQuickFilter, GridActionsCellItem, DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { saveAs } from 'file-saver';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip, Modal } from '@mui/material';
import { esES } from "@mui/x-data-grid/locales";
import { format } from 'date-fns';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import StatusCell from "../dashboard/elementos/StatusCell";
import { useSnackbar } from '../dashboard/elementos/SnackbarContext';

const localeText = {
  ...((esES.components.MuiDataGrid && esES.components.MuiDataGrid.defaultProps && esES.components.MuiDataGrid.defaultProps.localeText) || {})
};

const ItemGrid = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function ListarOperaciones ({ refrescar, regs })  {

  /////////// INICIA GLOBALES
  const [cargando, setCargando] = useState(false);

  /////////// INICIA FORMULARIO
  const [modo, setModo] = useState(null);
  const [dialogoFormulario, setDialogDialogoFormulario] = useState(false);
  const [registro, setRegistro] = useState(null);

  const abrirFomularioNuevo = () => {
    setModo("nuevo");
    setDialogDialogoFormulario(true);
  };

  const abrirFomularioEditar = (registro) => {
    setRegistro(registro);
    setModo("editar");
    setDialogDialogoFormulario(true);
  };

  const cerrarFomulario = (evento, razon) => {
    if (razon !== 'backdropClick') {
      setDialogDialogoFormulario(false);
      refrescar();
    }
  };
  /////////// FIN FORMULARIO

  /////////// INICIO DIALOGO ELIMINAR
  const [dialogoEliminar, setDialogoEliminar] = useState(false);

  const abrirDialogoEliminar = (id) => {
    const reg = regs.find(registro => registro.id === id);
    setRegistro(reg);
    setDialogoEliminar(true);
  };

  const cancelarDialogoEliminar = () => {
    setDialogoEliminar(false);
    setRegistro(null);
  };

  function confirmarDialogoEliminar() {
    eliminarOperacionApi(registro.id)  //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
      .then(respuesta => {
        addSnackbar(`Se eliminó correctamente el registro con clave: ${registro.id}`, "success");
        setDialogoEliminar(false);
        refrescar();
      }).catch(error => {
        console.log("FRACASOOOOOOOOO: " + error);
        if (error.response) {
          addSnackbar(error.response.data, "error");
        } else if (error.request) {
          addSnackbar("Error en la petición de eliminar: " + error.request.data, "error");
        } else {
          addSnackbar("Error inesperado al realizar la operación de eliminar: " + error.message, "error");
        }
      });
  };
  /////////// FIN DIALOGO ELIMINAR

  /////////// INICIO SNACKBAR
  const { addSnackbar } = useSnackbar();
  /////////// FIN SNACKBAR

  /////////// INICIO REPORTES
  const descargarReporte = async () => {
    setCargando(true);
    obtenerReporteOperacionApi() //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
      .then(respuesta => {
        const blob = new Blob([respuesta.data], { type: 'application/pdf' });
        const fileNameMatch = respuesta.headers.get('content-disposition').match(/filename\*?=['"]?(?:UTF-\d+'[^;]+|([^;]+))['"]?/i);
        saveAs(blob, fileNameMatch[1]);
        addSnackbar("Reporte generado correctamente", "success");
      }).catch(error => {
        addSnackbar("No se pudo generar el reporte, razón: " + error.message, "error");
        setCargando(false);
      });
  };
  /////////// FIN REPORTES

  //**********************INICIA CONFIGURACION DEL GRID
  const [tablaMaximizada, setTablaMaximizada] = useState(false);
  function controlarTabla() {
    if (tablaMaximizada)
      setTablaMaximizada(false);
    else
      setTablaMaximizada(true);
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton  />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button startIcon={<AspectRatioIcon />}
          sx={{
            color: (tablaMaximizada ? 'orangered' : 'warning'), padding: '0px 6px',
            minWidth: 'auto',
            height: 30, '& .MuiButton-startIcon': {
              marginRight: '4px',
            },
            '& .MuiButton-startIcon>*:nth-of-type(1)': {
              fontSize: '0.70rem',
            },
          }} onClick={controlarTabla}>{tablaMaximizada ? 'Minimizar' : 'Maximizar'}</Button>
      </GridToolbarContainer>
    );
  };

  const MUIDatagridToolbar = () => {
    return (
      <Grid container spacing={1} sx={{ border: 0 }}>
        <Grid item xs={4}>
          <ItemGrid>
            <Box padding={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                sx={{
                  height: 30,
                  minWidth: 95,
                  fontSize: '0.80rem',
                  padding: '6px 8px',
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5,
                    '& svg': {
                      fontSize: 18,
                    },
                  },
                }}
                onClick={abrirFomularioNuevo}
              >
                Nuevo
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                sx={{
                  height: 30,
                  minWidth: 95,
                  fontSize: '0.80rem',
                  padding: '6px 8px',
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5,
                    '& svg': {
                      fontSize: 18,
                    },
                  },
                }}
                onClick={refrescar}
              >
                Actualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<FeedIcon />}
                sx={{
                  height: 30,
                  minWidth: 95,
                  fontSize: '0.80rem',
                  padding: '6px 8px',
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5,
                    '& svg': {
                      fontSize: 18,
                    },
                  },
                }}
                onClick={descargarReporte}
              >
                Reporte
              </Button>
            </Box>
          </ItemGrid>
        </Grid>
        <Grid item xs={2}>
          <ItemGrid>
            <GridToolbarQuickFilter />
          </ItemGrid>
        </Grid>
        <Grid item xs={6}>
          <ItemGrid>
            <Box sx={{ display: 'flex', gap: 0, justifyContent: 'flex-end' }}>
              <CustomToolbar />
            </Box>
          </ItemGrid>
        </Grid>
      </Grid>
    );
  };
  //**********************FIN CONFIGURACION DEL GRID

  //**********************INICIA DEFINICION DE COLUMNAS 

  const columnas = [ //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
    {
      field: 'acciones', type: 'actions', width: 100, headerName: "Acciones", headerClassName: "super-app-theme--header",
      getActions: (params) => [
        <Tooltip title="Editar">
          <GridActionsCellItem icon={<EditIcon color="primary" />} label="Edit" onClick={() => abrirFomularioEditar(params.row)} aria-label="Edit" />
        </Tooltip>,
        <Tooltip title="Eliminar">
          <GridActionsCellItem icon={<DeleteIcon color="warning" />} label="Delete" onClick={() => abrirDialogoEliminar(params.id)} />
        </Tooltip>,
      ],
    },
    { field: "id", headerName: "Id", width: 60, headerClassName: "super-app-theme--header", pinned: 'left' },
    
    {
      field: "fecha", headerName: "Fecha creación", width: 150, headerClassName: "super-app-theme--header",
      valueFormatter: (params) => {
        if (params) { return format(new Date(params), 'dd/MM/yyyy HH:mm:ss'); } return '';
      },
    },
    { field: "modulo", headerName: "Módulo", width: 150, headerClassName: "super-app-theme--header" },
    { field: "registro", headerName: "Registro", width: 150, headerClassName: "super-app-theme--header" },
    { field: "ip", headerName: "IP", width: 150, headerClassName: "super-app-theme--header" },
    { field: "accion", headerName: "Acción", width: 150, headerClassName: "super-app-theme--header" },
    { field: "host", headerName: "Host", width: 150, headerClassName: "super-app-theme--header" },
  
  ];
  //**********************FIN DEFINICION DE COLUMNAS

  return (
    <Box sx={{ height: 480, width: "100%", border: 0 }}>
      <DataGrid
        slots={{ toolbar: MUIDatagridToolbar }}
        columns={columnas} rows={regs}
        initialState={{
          density: 'compact',
          pinnedColumns: { right: ['acciones'], left: ['id'] },
        }}
        columnPinning={{
          enablePinning: true,
        }}
        localeText={localeText}
        slotProps={{ pagination: { labelRowsPerPage: 'Registros por página' } }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          },
        }}
      />
      <Modal
        open={tablaMaximizada}
        onClose={controlarTabla}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '90%',
          bgcolor: 'background.paper',
          border: '1px solid #000',
          boxShadow: 24,
          p: 1,
        }}>
          <DataGrid
            slots={{ toolbar: MUIDatagridToolbar }}
            columns={columnas} rows={regs}
            initialState={{
              density: 'compact',
              pinnedColumns: { right: ['acciones'], left: ['id'] },
            }}
            columnPinning={{
              enablePinning: true,
            }}
            localeText={localeText}
            slotProps={{ pagination: { labelRowsPerPage: 'Registros por página' } }}
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      </Modal>
      {/*<FormularioUsuario modo={modo} registro={registro} open={dialogoFormulario} onClose={cerrarFomulario} refrescar={refrescar} />*/}
      <Dialog
        open={dialogoEliminar}
        onClose={cancelarDialogoEliminar}
      >
        <DialogTitle>{"Confirmar eliminar"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Está seguro de eliminar el registro: {registro?.id}{", "}{registro?.nombre}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" startIcon={<CancelIcon />} onClick={cancelarDialogoEliminar} >Cancelar</Button>
          <Button color="warning" variant="contained" startIcon={<CheckIcon />} onClick={confirmarDialogoEliminar} >Confirmar </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


