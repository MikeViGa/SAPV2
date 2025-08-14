import { useState } from "react";
import { eliminarVendedorApi, obtenerReporteVendedorApi } from "../../api/VendedorApiService";
import FormularioVendedor from "./FormularioVendedor";
import {
  FullScreenModal,
  DeleteDialog,
  ActionButtons,
  commonGridProps,
  localeText,
  useListado,
  DataGridBase,
  SplitButtonDropdown,
  ListLayout,
  useReportHandler,
} from '../../base/common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import { Box } from "@mui/material";

export default function ListarVendedores({ refrescar, regs }) {
  const listadoHook = useListado(eliminarVendedorApi);
  const [cargando, setCargando] = useState(false);
  const { addSnackbar } = useSnackbar();
  const options = ['Vendedores', 'Vendedores y subvendedores'];
  const descargarReporte = useReportHandler(obtenerReporteVendedorApi, addSnackbar, setCargando);

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
    {
      field: "supervisor",
      headerName: "Supervisor",
      width: 300,
      headerClassName: "super-app-theme--header",
      renderCell: (cellValues) => {
        const supervisor = cellValues.value;
        if (!supervisor) return '';
        return `${supervisor.nombre} ${supervisor.apellidoPaterno} ${supervisor.apellidoMaterno}`;
      }
    },
  ];

  const DataGridComponent = () => (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <DataGridBase
        columns={columnas}
        rows={rowsData}
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

  const handleReportSelect = (index, option) => {
    if (option === 'Vendedores') {
      descargarReporte('vendedores');
    } else if (option === 'Vendedores y subvendedores') {
      descargarReporte('vendedoressubvendedores');
    }
  };

  const reportComponent = (
    <SplitButtonDropdown
      options={options}
      onOptionSelect={handleReportSelect}
      buttonLabel="REPORTES"
      icon={<FeedIcon />}
    />
  );

  const dialogComponents = (
    <>
      <FormularioVendedor
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
}