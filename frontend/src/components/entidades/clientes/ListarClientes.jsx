import { useState } from "react";
import { eliminarClienteApi } from "../../api/ClienteApiService";
import { Button, } from "@mui/material";
import FormularioCliente from "./FormularioCliente";
import FeedIcon from '@mui/icons-material/Feed';
import FormularioReportesCliente from "./FormularioReportesCliente";
import { FullScreenModal, DeleteDialog, commonGridProps, localeText, ListLayout, ActionButtons, useListado, DataGridBase } from '../../base/common/CommonControls';

export default function ListarClientes({ refrescar, regs }) {
  const listadoHook = useListado(eliminarClienteApi);
  const [modo, setModo] = useState(null);
  const [dialogoFormularioReportes, setDialogoFormularioReportes] = useState(false);
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
    { field: "calle", headerName: "Calle", width: 200, headerClassName: "super-app-theme--header" },
    { field: "numeroExterior", headerName: "Número exterior", width: 150, headerClassName: "super-app-theme--header" },
    { field: "numeroInterior", headerName: "Número interior", width: 150, headerClassName: "super-app-theme--header" },
    { field: "colonia", headerName: "Colonia", width: 200, headerClassName: "super-app-theme--header" },
    { field: "ciudad", headerName: "Ciudad", width: 200, headerClassName: "super-app-theme--header" },
    { field: "estado", headerName: "Estado", width: 200, headerClassName: "super-app-theme--header" },
    { field: "codigoPostal", headerName: "Código postal", width: 150, headerClassName: "super-app-theme--header" },
    { field: "telefono1", headerName: "Teléfono 1", width: 150, headerClassName: "super-app-theme--header" },
    { field: "telefono2", headerName: "Teléfono 2", width: 150, headerClassName: "super-app-theme--header" },
    { field: "rfc", headerName: "RFC", width: 150, headerClassName: "super-app-theme--header" },
    { field: "fechaRegistro", headerName: "Fecha registro", width: 180, headerClassName: "super-app-theme--header" },
  ];

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
      <FormularioReportesCliente modo={modo} registro={registro} open={dialogoFormularioReportes} onClose={cerrarFomularioReportes} refrescar={refrescar} />
    </>
  );

  const DataGridComponent = () => (
    <DataGridBase
      columns={columnas}
      rows={regs}
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
};