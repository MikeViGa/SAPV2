import { Box, Button } from "@mui/material";
import { eliminarModuloApi } from "../../api/ModuloApiService";
import StatusCell from "../dashboard/elementos/StatusCell";
import FormularioModulo from "./FormularioModulo";
import { FullScreenModal, DeleteDialog, ActionButtons, commonGridProps, ListLayout, localeText, useListado, DataGridBase } from '../common/CommonControls';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../dashboard/elementos/SnackbarContext';

export default function ListarModulos  ({ refrescar, regs })  {

  const listadoHook = useListado(eliminarModuloApi);
  const { addSnackbar } = useSnackbar();
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
        <FormularioModulo
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
