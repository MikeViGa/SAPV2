import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { eliminarSolicitudApi, obtenerReporteSolicitudApi } from "../../api/SolicitudApiService";
import StatusCell from "../../base/dashboard/elementos/StatusCell";
import FormularioSolicitud from "./FormularioSolicitud";
import { FullScreenModal, DeleteDialog, ActionButtons, commonGridProps, commonButtonStyles, localeText, ListLayout, useListado, DataGridBase } from '../../base/common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';

export default function ListarSolicitudes({ refrescar, regs }) {

  const listadoHook = useListado(eliminarSolicitudApi);
  const { addSnackbar } = useSnackbar();

  const descargarReporte = async () => {
    listadoHook.setCargando(true);
    try {
      const respuesta = await obtenerReporteSolicitudApi();
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

  const rowsData = Array.isArray(regs?.rows) ? regs.rows : [];

  const columnas = [
    {
      field: 'acciones',
      type: 'actions',
      width: 100,
      headerName: "Acciones",
      headerClassName: "super-app-theme--header",
      getActions: (params) => ActionButtons({
        onEdit: () => listadoHook.abrirFomularioEditar(params.row),
        onDelete: () => listadoHook.abrirDialogoEliminar(params.id, rowsData)
      }),
    },
    { field: "id", headerName: "Id", width: 80, headerClassName: "super-app-theme--header", pinned: 'left' },
    { field: "claveSolicitud", headerName: "Clave", width: 120, headerClassName: "super-app-theme--header" },
    { field: "claveContrato", headerName: "Contrato", width: 130, headerClassName: "super-app-theme--header" },
    { field: "comision", headerName: "Comisión", width: 110, headerClassName: "super-app-theme--header" },
    { field: "fechaAlta", headerName: "Fecha alta", width: 120, headerClassName: "super-app-theme--header" },
    { field: "fechaVenta", headerName: "Fecha venta", width: 120, headerClassName: "super-app-theme--header" },
    { field: "fechaVencimiento", headerName: "Fecha venc.", width: 120, headerClassName: "super-app-theme--header" },
    { field: "fechaEntrega", headerName: "Fecha entrega", width: 120, headerClassName: "super-app-theme--header" },
    { field: "vendedorNombre", headerName: "Vendedor", width: 160, headerClassName: "super-app-theme--header" },
    { field: "clienteNombre", headerName: "Cliente", width: 160, headerClassName: "super-app-theme--header" },
    { field: "sucursalNombre", headerName: "Sucursal", width: 160, headerClassName: "super-app-theme--header" },
    { field: "paqueteClave", headerName: "Paquete", width: 120, headerClassName: "super-app-theme--header" },
  ];

  // Paginación server-side (mismo patrón que ListarClientes)
  const [paginationModel, setPaginationModel] = useState({ page: regs?.page ?? 0, pageSize: regs?.pageSize ?? 50 });

  useEffect(() => {
    if (typeof regs?.page === 'number' && typeof regs?.pageSize === 'number') {
      setPaginationModel({ page: regs.page, pageSize: regs.pageSize });
    }
  }, [regs?.page, regs?.pageSize]);

  const DataGridComponent = () => (
    <DataGridBase
      columns={columnas}
      rows={rowsData}
      onNew={listadoHook.abrirFomularioNuevo}
      onRefresh={() => refrescar(paginationModel?.page ?? 0, paginationModel?.pageSize ?? 50)}
      commonGridProps={commonGridProps}
      localeText={localeText}
      tablaMaximizada={listadoHook.tablaMaximizada}
      controlarTabla={listadoHook.controlarTabla}
      props={{
        pagination: true,
        paginationMode: 'server',
        rowCount: regs?.total ?? 0,
        paginationModel,
        onPaginationModelChange: (model) => {
          console.log('onPaginationModelChange llamado con model:', model);
          setPaginationModel(model);
          console.log('Llamando refrescar con page:', model.page, 'pageSize:', model.pageSize);
          refrescar(model.page, model.pageSize);
        },
        pageSizeOptions: [25, 50, 100],
      }}
    />
  );

  const dialogComponents = (
    <>
      <FormularioSolicitud
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