import { Button } from "@mui/material";
import { eliminarUsuarioApi, obtenerReporteUsuarioApi } from "../../api/UsuarioApiService";
import StatusCell from "../dashboard/elementos/StatusCell";
import FormularioUsuario from "./FormularioUsuario";
import { FullScreenModal, DeleteDialog, ActionButtons, commonGridProps, ListLayout, commonButtonStyles, localeText, useListado, DataGridBase } from '../common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';

export default function ListarUsuarios({ refrescar, regs }) {
  const listadoHook = useListado(eliminarUsuarioApi);
  const { addSnackbar } = useSnackbar();

  const descargarReporte = async () => {
    listadoHook.setCargando(true);
    try {
      const respuesta = await obtenerReporteUsuarioApi();
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
    { field: "nombre", headerName: "Nombre", width: 150, headerClassName: "super-app-theme--header" },
    {
      field: "rol",
      headerName: "Rol",
      width: 160,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <span>{params.row.rol?.nombre || 'Sin rol'}</span>
      )
    }
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

  const reportComponent = (
    <Button
      variant="contained"
      startIcon={<FeedIcon />}
      sx={commonButtonStyles}
      onClick={descargarReporte}
    >
      Reporte
    </Button>
  );

  const dialogComponents = (
  <>
    {listadoHook.dialogoFormulario && (
      <FormularioUsuario
        key={`${listadoHook.modo}-${listadoHook.registro?.id || 'new'}`} // Add this key
        modo={listadoHook.modo}
        registro={listadoHook.modo === 'crear' ? null : listadoHook.registro}
        open={listadoHook.dialogoFormulario}
        onClose={(e, r) => listadoHook.cerrarFomulario(e, r, refrescar)}
        refrescar={refrescar}
      />
    )}
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
}