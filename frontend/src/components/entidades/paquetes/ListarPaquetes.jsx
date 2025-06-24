import { Box, Button } from "@mui/material";
import { eliminarPaqueteApi, obtenerReportePaqueteApi } from "../../api/PaqueteApiService";
import StatusCell from "../../base/dashboard/elementos/StatusCell";
import FormularioPaquete from "./FormularioPaquete";
import { FullScreenModal, DeleteDialog, ActionButtons, commonGridProps, commonButtonStyles, localeText, ListLayout, useListado, DataGridBase } from '../../base/common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';

export default function ListarPaquetes({ refrescar, regs }) {

  const listadoHook = useListado(eliminarPaqueteApi);
  const { addSnackbar } = useSnackbar();

  const descargarReporte = async () => {
    listadoHook.setCargando(true);
    try {
      const respuesta = await obtenerReportePaqueteApi();
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
    { field: "servicios", headerName: "Servicios", width: 100, headerClassName: "super-app-theme--header" },
    { field: "numeroDePagos", headerName: "Num pagos", width: 100, headerClassName: "super-app-theme--header" },
    { field: "valorTotal", headerName: "Valor total", width: 120, headerClassName: "super-app-theme--header" },
    { field: "enganche", headerName: "Enganche", width: 120, headerClassName: "super-app-theme--header" },
    { field: "importe", headerName: "Importe", width: 120, headerClassName: "super-app-theme--header" },
    { field: "plazosdepago", headerName: "Plazos de pago", width: 150, headerClassName: "super-app-theme--header" },
    { field: "listadeprecios", headerName: "Lista de precios", width: 150, headerClassName: "super-app-theme--header" },
    { field: "periodicidad", headerName: "Periodicidad", width: 120, headerClassName: "super-app-theme--header" },
    { field: "bovedas", headerName: "Bovedas", width: 100, headerClassName: "super-app-theme--header" },
    { field: "gavetas", headerName: "Gavetas", width: 100, headerClassName: "super-app-theme--header" },
  ];

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
      <FormularioPaquete
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