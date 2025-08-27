import { Box, Button } from "@mui/material";
import { useMemo } from "react";
import { eliminarPaqueteApi, obtenerReportePaqueteApi, restaurarPaqueteApi } from "../../api/PaqueteApiService";
import StatusCell from "../../base/dashboard/elementos/StatusCell";
import FormularioPaquete from "./FormularioPaquete";
import { FullScreenModal, DeleteDialog, ActionButtons, commonGridProps, commonButtonStyles, localeText, ListLayout, useListado, DataGridBase } from '../../base/common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';

export default function ListarPaquetes({ refrescar, regs }) {

  const listadoHook = useListado(eliminarPaqueteApi);
  const { addSnackbar } = useSnackbar();
  const rowsData = useMemo(() => (
    Array.isArray(regs?.rows) ? regs.rows : (Array.isArray(regs) ? regs : [])
  ), [regs]);

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

  const restaurarPaquete = async (id) => {
    listadoHook.setCargando(true);
    try {
      await restaurarPaqueteApi(id);
      addSnackbar("Paquete restaurado correctamente", "success");
      refrescar();
    } catch (error) {
      addSnackbar("No se pudo restaurar el paquete, razón: " + error.message, "error");
    } finally {
      listadoHook.setCargando(false);
    }
  };

  const columnas = useMemo(() => [
    {
      field: 'acciones',
      type: 'actions',
      width: 100,
      headerName: "Acciones",
      headerClassName: "super-app-theme--header",
      getActions: (params) => ActionButtons({
        onEdit: () => listadoHook.abrirFomularioEditar(params.row),
        onDelete: params.row.activo ? () => listadoHook.abrirDialogoEliminar(params.id, rowsData) : null,
        onRestore: !params.row.activo ? () => restaurarPaquete(params.id) : null,
        showRestore: !params.row.activo
      }),
    },
    { field: "id", headerName: "Id", width: 60, headerClassName: "super-app-theme--header", pinned: 'left' },
    { field: "clave", headerName: "Clave", width: 120, headerClassName: "super-app-theme--header" },
    { field: "servicios", headerName: "Servicios", width: 100, headerClassName: "super-app-theme--header" },
    { field: "numeroPagos", headerName: "Num pagos", width: 100, headerClassName: "super-app-theme--header" },
    { field: "valorTotal", headerName: "Valor total", width: 120, headerClassName: "super-app-theme--header" },
    { field: "enganche", headerName: "Enganche", width: 120, headerClassName: "super-app-theme--header" },
    { field: "importe", headerName: "Importe", width: 120, headerClassName: "super-app-theme--header" },
    { field: "plazoDePagoNombre", headerName: "Plazo de pago", width: 150, headerClassName: "super-app-theme--header",
      renderCell: (params) => (params?.row?.plazoDePagoNombre ?? params?.row?.plazoDePago?.nombre ?? '') },
    { field: "listaDePreciosNombre", headerName: "Lista de precios", width: 170, headerClassName: "super-app-theme--header",
      renderCell: (params) => (params?.row?.listaDePreciosNombre ?? params?.row?.listaDePrecios?.nombre ?? '') },
    { field: "periodicidadNombre", headerName: "Periodicidad", width: 140, headerClassName: "super-app-theme--header",
      renderCell: (params) => (params?.row?.periodicidadNombre ?? params?.row?.periodicidad?.nombre ?? '') },
    { field: "bovedas", headerName: "Bovedas", width: 100, headerClassName: "super-app-theme--header" },
    { field: "gavetas", headerName: "Gavetas", width: 100, headerClassName: "super-app-theme--header" },
    { 
      field: "activo", 
      headerName: "Estado", 
      width: 100, 
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <StatusCell 
          status={params.value} 
          activeText="Activo" 
          inactiveText="Inactivo" 
        />
      )
    },
    { field: "fechaCreacion", headerName: "Fecha Creación", width: 150, headerClassName: "super-app-theme--header" },
    { field: "fechaModificacion", headerName: "Fecha Modificación", width: 150, headerClassName: "super-app-theme--header" },
    { field: "creadoPor", headerName: "Creado Por", width: 120, headerClassName: "super-app-theme--header" },
    { field: "modificadoPor", headerName: "Modificado Por", width: 120, headerClassName: "super-app-theme--header" },
  ], [listadoHook, restaurarPaquete]);

  const dataGridExtraProps = useMemo(() => ({
    initialState: {
      ...commonGridProps.initialState,
      pagination: {
        paginationModel: { pageSize: 25, page: 0 },
      },
    },
    pageSizeOptions: [10, 25, 50, 100],
    pagination: true,
    rowBuffer: 2,
    disableRowSelectionOnClick: true,
    loading: listadoHook.cargando,
  }), [listadoHook.cargando]);

  const DataGridComponent = () => (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <DataGridBase
        columns={columnas}
        rows={rowsData}
        onNew={listadoHook.abrirFomularioNuevo}
        onRefresh={refrescar}
        commonGridProps={{ ...commonGridProps }}
        localeText={localeText}
        tablaMaximizada={listadoHook.tablaMaximizada}
        controlarTabla={listadoHook.controlarTabla}
        props={dataGridExtraProps}
      />
    </Box>
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