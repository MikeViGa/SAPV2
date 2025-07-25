import { useState, useRef } from "react";
import {
  Box, ButtonGroup, Button, Popper, Grow, Paper,
  ClickAwayListener, MenuList, MenuItem, Grid, Modal, Dialog, DialogActions,
  DialogContent, DialogTitle, DialogContentText, Switch, Tooltip
} from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridActionsCellItem,
  DataGrid
} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { styled } from '@mui/material/styles';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect } from "react";
import { useSnackbar } from "../dashboard/elementos/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import Cargando from "../dashboard/elementos/Cargando";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FeedIcon from '@mui/icons-material/Feed';
import { saveAs } from 'file-saver';

export const ItemGrid = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#1890ff',
        ...theme.applyStyles('dark', {
          backgroundColor: '#177ddc',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgba(255,255,255,.35)',
    }),
  },
}));

export const localeText = {
  ...((esES.components.MuiDataGrid && esES.components.MuiDataGrid.defaultProps && esES.components.MuiDataGrid.defaultProps.localeText) || {})
};

// Common Styles
export const redAsteriskStyle = {
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
};

// Grid Components
export const CustomToolbar = ({ tablaMaximizada, controlarTabla }) => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        startIcon={<AspectRatioIcon />}
        sx={{
          color: (tablaMaximizada ? 'orangered' : 'warning'),
          padding: '0px 6px',
          minWidth: 'auto',
          height: 30,
          '& .MuiButton-startIcon': {
            marginRight: '4px',
          },
          '& .MuiButton-startIcon>*:nth-of-type(1)': {
            fontSize: '0.70rem',
          },
        }}
        onClick={controlarTabla}
      >
        {tablaMaximizada ? 'Minimizar' : 'Maximizar'}
      </Button>
    </GridToolbarContainer>
  );
};

// Common Button Styles
export const commonButtonStyles = {
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
};

// Grid Common Styles
export const gridCommonStyles = {
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
  },
};

// Form Common Props
export const formCommonProps = {
  size: "small",
  fullWidth: true,
  required: true,
  InputLabelProps: {
    sx: redAsteriskStyle,
    shrink: true,
  },
};

export const DataGridToolbar = ({ onNew, onRefresh, tablaMaximizada, controlarTabla, extraButtons }) => (
  <Grid container spacing={1}>
    <Grid item xs={4}>
      <ItemGrid>
        <Box padding={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={commonButtonStyles}
            onClick={onNew}
          >
            Nuevo
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={commonButtonStyles}
            onClick={onRefresh}
          >
            Actualizar
          </Button>
          {extraButtons}
        </Box>
      </ItemGrid>
    </Grid>
    <Grid item xs={2}>
      <ItemGrid>
        <GridToolbarQuickFilter />
      </ItemGrid>
    </Grid>
    <Grid item xs={6}>
      <ItemGrid>
        <Box sx={{ display: 'flex', gap: 0, justifyContent: 'flex-end' }}>
          <CustomToolbar
            tablaMaximizada={tablaMaximizada}
            controlarTabla={controlarTabla}
          />
        </Box>
      </ItemGrid>
    </Grid>
  </Grid>
);

export const DeleteConfirmationDialog = ({ open, onClose, onConfirm, registro }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmar eliminar</DialogTitle>
    <DialogContent>
      <DialogContentText>
        ¿Está seguro de eliminar el registro: {registro?.id}{", "}{registro?.nombre}?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        color="primary"
        variant="contained"
        startIcon={<CancelIcon />}
        onClick={onClose}
      >
        Cancelar
      </Button>
      <Button
        color="warning"
        variant="contained"
        startIcon={<CheckIcon />}
        onClick={onConfirm}
      >
        Confirmar
      </Button>
    </DialogActions>
  </Dialog>
);

export const FullScreenModal = ({ open, onClose, children }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '90%',
      bgcolor: 'background.paper',
      border: '1px solid #000',
      boxShadow: 24,
      p: 1,
    }}>
      {children}
    </Box>
  </Modal>
);

export const ScreenWrapper = ({ children, loading }) => (
  <Box padding={1} sx={{ display: 'flex', justifyContent: 'center', width: '75%' }}>
    {loading && <Cargando loading={loading} />}
    <Stack spacing={1} sx={{ width: '100%' }}>
      {children}
    </Stack>
  </Box>
);

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const ExitButton = ({ onClick }) => (
  <Item>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        startIcon={<ExitToAppIcon />}
        sx={{ margin: 0.3, height: 30 }}
        onClick={onClick}
      >
        Salir
      </Button>
    </Box>
  </Item>
);

export const useScreenCommon = (moduleName, initialFetch) => {
  const navigate = useNavigate();
  const { addSnackbar } = useSnackbar();
  const [cargando, setCargando] = useState(false);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    sessionStorage.setItem('nombreModulo', moduleName);
    if (initialFetch) {
      cargarRegistrosIniciales();
    }
  }, []);

  const cargarRegistrosIniciales = async () => {
    try {
      await initialFetch(setRegistros, setCargando, addSnackbar);
    } catch (error) {
      console.error("Error cargando registros iniciales:", error);
      addSnackbar("Error al cargar los registros iniciales", "error");
    }
  };

  const salirModulo = () => navigate("/inicio/escritorio");

  return {
    cargando,
    setCargando,
    registros,
    setRegistros,
    salirModulo,
    addSnackbar
  };

};

export const ActionButtons = ({ onEdit, onDelete }) => [
  <Tooltip title="Editar">
    <GridActionsCellItem
      icon={<EditIcon color="primary" />}
      label="Edit"
      onClick={onEdit}
    />
  </Tooltip>,
  <Tooltip title="Eliminar">
    <GridActionsCellItem
      icon={<DeleteIcon color="warning" />}
      label="Delete"
      onClick={onDelete}
    />
  </Tooltip>,
];

export const commonGridProps = {
  initialState: {
    density: 'compact',
    pinnedColumns: { right: ['acciones'], left: ['id'] },
  },
  columnPinning: {
    enablePinning: true,
  },
  slotProps: {
    pagination: {
      labelRowsPerPage: 'Registros por página'
    }
  },
  sx: {
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
    },
  },
};

export const DeleteDialog = ({ open, onClose, onConfirm, registro }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmar eliminar</DialogTitle>
    <DialogContent>
      <DialogContentText>
        ¿Está seguro de eliminar el registro: {registro?.id}{", "}{registro?.nombre}?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        color="primary"
        variant="contained"
        startIcon={<CancelIcon />}
        onClick={onClose}
      >
        Cancelar
      </Button>
      <Button
        color="warning"
        variant="contained"
        startIcon={<CheckIcon />}
        onClick={onConfirm}
      >
        Confirmar
      </Button>
    </DialogActions>
  </Dialog>
);

export const useListado = (eliminarApi) => {
  const { addSnackbar } = useSnackbar();
  const [cargando, setCargando] = useState(false);
  const [tablaMaximizada, setTablaMaximizada] = useState(false);
  const [modo, setModo] = useState(null);
  const [dialogoFormulario, setDialogoFormulario] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);

  const abrirFomularioNuevo = () => {
    setRegistro(null);
    setModo("nuevo");
    setDialogoFormulario(true);
  };

  const abrirFomularioEditar = (registro) => {
    setRegistro(registro);
    setModo("editar");
    setDialogoFormulario(true);
  };

  const cerrarFomulario = (evento, razon, refrescar) => {
    if (razon !== 'backdropClick') {
      setDialogoFormulario(false);
      refrescar();
    }
  };

  const abrirDialogoEliminar = (id, regs) => {
    const reg = regs.find(registro => registro.id === id);
    setRegistro(reg);
    setDialogoEliminar(true);
  };

  const cancelarDialogoEliminar = () => {
    setDialogoEliminar(false);
    setRegistro(null);
  };

  const confirmarDialogoEliminar = async (refrescar) => {
    try {
      await eliminarApi(registro.id);
      addSnackbar(`Se eliminó correctamente el registro con clave: ${registro.id}`, "success");
      setDialogoEliminar(false);
      refrescar();
    } catch (error) {
      const errorMessage = error.response?.data ||
        error.request?.data && `Error en la petición de eliminar: ${error.request.data}` ||
        `Error inesperado al eliminar: ${error.message}`;
      addSnackbar(errorMessage, "error");
    }
  };

  const controlarTabla = () => setTablaMaximizada(!tablaMaximizada);

  return {
    cargando,
    setCargando,
    tablaMaximizada,
    modo,
    dialogoFormulario,
    registro,
    dialogoEliminar,
    abrirFomularioNuevo,
    abrirFomularioEditar,
    cerrarFomulario,
    abrirDialogoEliminar,
    cancelarDialogoEliminar,
    confirmarDialogoEliminar,
    controlarTabla
  };
};

export const DataGridBase = ({
  columns,
  rows,
  onNew,
  onRefresh,
  extraButtons,
  commonGridProps,
  localeText,
  tablaMaximizada,
  controlarTabla,
  props
}) => (
  <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
    <DataGrid
      {...commonGridProps}
      localeText={localeText}
      slots={{
        toolbar: () => (
          <DataGridToolbar
            onNew={onNew}
            onRefresh={onRefresh}
            extraButtons={extraButtons}
            tablaMaximizada={tablaMaximizada}
            controlarTabla={controlarTabla}
          />
        )
      }}
      slotProps={{
        pagination: {
          showFirstButton: true,
          showLastButton: true,
        },
      }}
      sx={{
        ...commonGridProps?.sx,
        '& .MuiDataGrid-virtualScroller': {
          overflowX: 'auto !important', // explicitly set to auto
        },
        '& .MuiDataGrid-main': {
          overflow: 'auto', // explicitly set to auto
        },
        '& .MuiDataGrid-root': {
          width: '100%',
          height: '100%'
        }
      }}
      {...props}
      columns={columns}
      rows={rows}
    />
  </div>
);

// Styled component for borderless paper
export const BorderlessPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(0.1),
  color: theme.palette.text.secondary,
  boxShadow: 'none',
  border: 'none',
}));

// Generic report button component
export const ReportButton = ({ onClick, label = "REPORTE" }) => (
  <Button
    variant="contained"
    startIcon={<FeedIcon />}
    sx={commonButtonStyles}
    onClick={onClick}
  >
    {label}
  </Button>
);

export const ListLayout = ({
  height = 480,
  dataGridHeight = 430,
  children,
  dataGridComponent,
  reportComponent,
  dialogComponents
}) => (
  <Box sx={{ height, width: "100%", overflow: 'hidden' }}>
    <Grid container spacing={0.5}>
      <Grid item xs={12}>
        <BorderlessPaper>
          <Box sx={{ height: dataGridHeight, width: "100%", overflow: 'auto' }}>
            {dataGridComponent}
          </Box>
        </BorderlessPaper>
      </Grid>
      <Grid item xs={12}>
        <BorderlessPaper>
          {reportComponent}
        </BorderlessPaper>
      </Grid>
    </Grid>
    {children}
    {dialogComponents}
  </Box>
);

export const useReportHandler = (reportApiFunction, addSnackbar, setCargando) => {
  return async (reportType) => {
    setCargando(true);
    try {
      const respuesta = await reportApiFunction(reportType);
      const blob = new Blob([respuesta.data], { type: 'application/pdf' });
      const fileNameMatch = respuesta.headers.get('content-disposition').match(/filename\*?=['"]?(?:UTF-\d+'[^;]+|([^;]+))['"]?/i);
      saveAs(blob, fileNameMatch[1]);
      addSnackbar("Reporte generado correctamente", "success");
    } catch (error) {
      addSnackbar("No se pudo generar el reporte, razón: " + error.message, "error");
    } finally {
      setCargando(false);
    }
  };
};

export const SplitButtonDropdown = ({
  buttonLabel = "REPORTES",
  options = [],
  onOptionSelect,
  icon = <FeedIcon />,
  disabledIndices = [],
  onMainButtonClick
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = (event, index) => {
    onOptionSelect(index, options[index]);
    setOpen(false);
  };

  const handleClick = (event) => {
    if (onMainButtonClick) {
      onMainButtonClick(event);
    }
  };

  return (
    <Box padding={0.3} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.2 }}>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button
          onClick={handleClick}
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
        >REPORTES
        </Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
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
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1300 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};