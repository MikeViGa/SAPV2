import { useState } from "react";
import { eliminarClienteApi } from "../../api/ClienteApiService";
import { Button, Dialog, DialogTitle, DialogContent, Typography, Box, Chip, IconButton } from "@mui/material";
import FormularioCliente from "./FormularioCliente";
import FeedIcon from '@mui/icons-material/Feed';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import FormularioReportesCliente from "./FormularioReportesCliente";
import { FullScreenModal, DeleteDialog, commonGridProps, localeText, ListLayout, ActionButtons, useListado, DataGridBase } from '../../base/common/CommonControls';

export default function ListarClientes({ refrescar, regs }) {
  const listadoHook = useListado(eliminarClienteApi);
  const [modo, setModo] = useState(null);
  const [dialogoFormularioReportes, setDialogoFormularioReportes] = useState(false);
  const [dialogoDomicilios, setDialogoDomicilios] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [registro, setRegistro] = useState(null);

  const abrirFormularioReportes = () => {
    setDialogoFormularioReportes(true);
  };

  const cerrarFomularioReportes = (evento, razon) => {
    if (razon !== 'backdropClick') {
      setDialogoFormularioReportes(false);
      refrescar();
    }
  };

  const abrirDialogoDomicilios = (cliente) => {
    setClienteSeleccionado(cliente);
    setDialogoDomicilios(true);
  };

  const cerrarDialogoDomicilios = () => {
    setDialogoDomicilios(false);
    setClienteSeleccionado(null);
  };

  const columnas = [
    {
      field: 'acciones',
      type: 'actions',
      width: 100,
      headerName: "Acciones",
      headerClassName: "super-app-theme--header",
      getActions: (params) => ActionButtons({
        onEdit: () => listadoHook.abrirFomularioEditar(params.row),
        onDelete: () => listadoHook.abrirDialogoEliminar(params.id, regs)
      }),
    },
    { field: "id", headerName: "Id", width: 60, headerClassName: "super-app-theme--header", pinned: 'left' },
    { field: "nombre", headerName: "Nombre", width: 200, headerClassName: "super-app-theme--header" },
    { field: "apellidoPaterno", headerName: "Apellido paterno", width: 150, headerClassName: "super-app-theme--header" },
    { field: "apellidoMaterno", headerName: "Apellido materno", width: 150, headerClassName: "super-app-theme--header" },
    { field: "fechaRegistro", headerName: "Fecha registro", width: 180, headerClassName: "super-app-theme--header" },
    { field: "telefono1", headerName: "Teléfono 1", width: 150, headerClassName: "super-app-theme--header" },
    { field: "telefono2", headerName: "Teléfono 2", width: 150, headerClassName: "super-app-theme--header" },
    { field: "rfc", headerName: "RFC", width: 150, headerClassName: "super-app-theme--header" },
    { field: "ocupacion", headerName: "Ocupación", width: 150, headerClassName: "super-app-theme--header" },
    { 
      field: "cantidadDomicilios", 
      headerName: "Domicilios", 
      width: 120, 
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Chip 
          label={`${params.row.cantidadDomicilios || 0} domicilio${params.row.cantidadDomicilios !== 1 ? 's' : ''}`}
          size="small"
          color={params.row.cantidadDomicilios > 0 ? "success" : "default"}
        />
      )
    },
    
  ];

  const DialogoDomicilios = () => (
    <Dialog 
      open={dialogoDomicilios} 
      onClose={cerrarDialogoDomicilios}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Domicilios de {clienteSeleccionado?.nombre} {clienteSeleccionado?.apellidoPaterno} {clienteSeleccionado?.apellidoMaterno}
          </Typography>
          <IconButton onClick={cerrarDialogoDomicilios}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {clienteSeleccionado?.domicilios && clienteSeleccionado.domicilios.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {clienteSeleccionado.domicilios.map((domicilio, index) => (
              <Box 
                key={domicilio.id || index}
                sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2, 
                  padding: 2,
                  backgroundColor: '#f9f9f9'
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  Domicilio {index + 1}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                  <Typography><strong>Calle:</strong> {domicilio.calle || 'N/A'}</Typography>
                  <Typography><strong>Número Exterior:</strong> {domicilio.numeroExterior || 'N/A'}</Typography>
                  <Typography><strong>Número Interior:</strong> {domicilio.numeroInterior || 'N/A'}</Typography>
                  <Typography><strong>Colonia:</strong> {domicilio.colonia || 'N/A'}</Typography>
                  <Typography><strong>Ciudad:</strong> {domicilio.ciudad || 'N/A'}</Typography>
                  <Typography><strong>Código Postal:</strong> {domicilio.codigoPostal || 'N/A'}</Typography>
                </Box>
                {domicilio.entreCalles && (
                  <Typography sx={{ mt: 1 }}>
                    <strong>Entre calles:</strong> {domicilio.entreCalles}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <HomeIcon sx={{ fontSize: 48, color: 'gray', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Este cliente no tiene domicilios registrados
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

  const reportComponent = (
    <>
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
        onClick={abrirFormularioReportes}
      >
        Reportes
      </Button>
      <FormularioReportesCliente 
        modo={modo} 
        registro={registro} 
        open={dialogoFormularioReportes} 
        onClose={cerrarFomularioReportes} 
        refrescar={refrescar} 
      />
    </>
  );

  const DataGridComponent = () => (
    <DataGridBase
      columns={columnas}
      rows={Array.isArray(regs) ? regs : []}
      onNew={listadoHook.abrirFomularioNuevo}
      onRefresh={refrescar}
      commonGridProps={commonGridProps}
      localeText={localeText}
      tablaMaximizada={listadoHook.tablaMaximizada}
      controlarTabla={listadoHook.controlarTabla}
    />
  );

  const dialogComponents = (
    <>
      <FormularioCliente
        modo={listadoHook.modo}
        registro={listadoHook.registro}
        open={listadoHook.dialogoFormulario}
        onClose={(e, r) => listadoHook.cerrarFomulario(e, r, refrescar)}
        refrescar={refrescar}
      />
      <DeleteDialog
        open={listadoHook.dialogoEliminar}
        onClose={listadoHook.cancelarDialogoEliminar}
        onConfirm={() => listadoHook.confirmarDialogoEliminar(refrescar)}
        registro={listadoHook.registro}
      />
      <DialogoDomicilios />
    </>
  );

  return (
    <ListLayout
      dataGridComponent={<DataGridComponent />}
      reportComponent={reportComponent}
      dialogComponents={dialogComponents}
    >
      <FullScreenModal
        open={listadoHook.tablaMaximizada}
        onClose={listadoHook.controlarTabla}
      >
        <DataGridComponent />
      </FullScreenModal>
    </ListLayout>
  );
}