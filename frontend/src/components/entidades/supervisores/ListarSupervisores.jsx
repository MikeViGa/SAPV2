import { Box, Button } from "@mui/material";
import { eliminarSupervisorApi, obtenerReporteSupervisorApi } from "../../api/SupervisorApiService";
import FormularioSupervisor from "./FormularioSupervisor";
import { FullScreenModal, DeleteDialog, ActionButtons, commonGridProps, commonButtonStyles, ListLayout, localeText, useListado, DataGridBase } from '../../base/common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export default function ListarSupervisores({ refrescar, regs }) {

  const listadoHook = useListado(eliminarSupervisorApi);
  const { addSnackbar } = useSnackbar();

  const descargarReporte = async () => {
    listadoHook.setCargando(true);
    try {
      const respuesta = await obtenerReporteSupervisorApi();
      const blob = new Blob([respuesta.data], { type: 'application/pdf' });
      const fileNameMatch = respuesta.headers.get('content-disposition').match(/filename\*?=['"]?(?:UTF-\d+'[^;]+|([^;]+))['"]?/i);
      saveAs(blob, fileNameMatch[1]);
      addSnackbar("Reporte generado correctamente", "success");
    } catch (error) {
      addSnackbar("No se pudo generar el reporte, razón: " + error.message, "error");
    } finally {
      listadoHook.setCargando(false);
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
    { field: "regimen", headerName: "Régimen", width: 100, headerClassName: "super-app-theme--header" },
    { field: "rfc", headerName: "RFC", width: 150, headerClassName: "super-app-theme--header" },
    { field: "curp", headerName: "CURP", width: 200, headerClassName: "super-app-theme--header" },
    { field: "numeroTarjeta", headerName: "Número tarjeta", width: 150, headerClassName: "super-app-theme--header" },
    { field: "fechaAlta", headerName: "Fecha alta", width: 180, headerClassName: "super-app-theme--header" },
    { field: "comision", headerName: "Comisión", width: 180, headerClassName: "super-app-theme--header" },
  ];

  const DataGridComponent = () => (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <DataGridBase
        columns={columnas}
        rows={regs}
        onNew={listadoHook.abrirFomularioNuevo}
        onRefresh={refrescar}
        commonGridProps={{
          ...commonGridProps,
        }}
        localeText={localeText}
        tablaMaximizada={listadoHook.tablaMaximizada}
        controlarTabla={listadoHook.controlarTabla}
      />
    </Box>
  );

  const reportComponent = (
    <Box padding={0.3} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.2 }}>
      <Button
        variant="contained"
        startIcon={<FeedIcon />}
        sx={commonButtonStyles}
        onClick={descargarReporte}
      >
        REPORTE
      </Button>
    </Box>
  );

  const dialogComponents = (
    <>
      <FormularioSupervisor
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