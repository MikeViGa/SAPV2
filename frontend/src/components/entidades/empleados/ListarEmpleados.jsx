import { Button } from "@mui/material";
import { eliminarEmpleadoApi, obtenerReporteEmpleadoApi } from "../../api/EmpleadoApiService";
import StatusCell from "../../base/dashboard/elementos/StatusCell";
import FormularioEmpleado from "./FormularioEmpleado";
import { FullScreenModal, DeleteDialog, ActionButtons, commonGridProps, commonButtonStyles, localeText, ListLayout, useListado, DataGridBase } from '../../base/common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import { format } from 'date-fns';

export default function ListarEmpleados({ refrescar, regs }) {

  const listadoHook = useListado(eliminarEmpleadoApi);
  const { addSnackbar } = useSnackbar();

  const descargarReporte = async () => {
    listadoHook.setCargando(true);
    try {
      const respuesta = await obtenerReporteEmpleadoApi();
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

  const rowsData = Array.isArray(regs?.rows) ? regs.rows : (Array.isArray(regs) ? regs : []);

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

    { field: "id", headerName: "Id", width: 60, headerClassName: "super-app-theme--header", pinned: 'left' },
    { field: "nombre", headerName: "Nombre", width: 200, headerClassName: "super-app-theme--header" },
    { field: "apellidoPaterno", headerName: "Apellido paterno", width: 150, headerClassName: "super-app-theme--header" },
    { field: "apellidoMaterno", headerName: "Apellido materno", width: 150, headerClassName: "super-app-theme--header" },
    {
      field: "fechaNacimiento", headerName: "Fecha nacimiento", width: 150, headerClassName: "super-app-theme--header",
      valueFormatter: (params) => {
        if (params) { return format(new Date(params), 'dd/MM/yyyy'); } return '';
      },
    },
    { field: "correo", headerName: "Correo", width: 150, headerClassName: "super-app-theme--header" },
    { field: "telefono", headerName: "Teléfono", width: 150, headerClassName: "super-app-theme--header" },
    {
      field: "fechaAlta", headerName: "Fecha alta", width: 150, headerClassName: "super-app-theme--header",
      valueFormatter: (params) => {
        if (params) { return format(new Date(params), 'dd/MM/yyyy'); } return '';
      },
    },
    {
      field: 'estado', headerName: 'Estado', width: 120,
      renderCell: (params) => {

        return <StatusCell value={params.row.estado} />;
      },
    },
  ];

  const DataGridComponent = () => (
    <DataGridBase
      columns={columnas}
      rows={rowsData}
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
      <FormularioEmpleado
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