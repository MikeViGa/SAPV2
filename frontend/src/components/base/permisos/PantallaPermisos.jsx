import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button, Box, Typography, Checkbox } from "@mui/material";
import Cargando from '../../base/dashboard/elementos/Cargando';
import { useSnackbar } from '../../base/dashboard/elementos/SnackbarContext';
import { obtenerRolesApi } from '../../api/RolApiService';
import { obtenerPermisosRolApi } from '../../api/PermisoApiService';
import { obtenerPermisosApi } from '../../api/PermisoApiService';
import { actualizarPermisoApi } from '../../api/PermisoApiService';
import { DataGrid } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import { esES } from "@mui/x-data-grid/locales";

const localeText = {
    ...((esES.components.MuiDataGrid && esES.components.MuiDataGrid.defaultProps && esES.components.MuiDataGrid.defaultProps.localeText) || {})
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

const redAsteriskStyle = {
    '& .MuiInputLabel-asterisk': {
        color: 'red',
    },
};

export default function PantallaPermisos() {

    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('nombreModulo', 'Permisos'); //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
        obtenerRolesApi().
            then(respuesta => {
                setRoles(respuesta.data);
            }).catch(error => {
                console.error("Error obteniendo registros:", error);
            });
    }, []);

    const navigate = useNavigate();
    const salirModulo = () => {
        navigate("/inicio/escritorio")
    };

    const [idRegistro, setIdRegistro] = useState(null);
    const [registros, setRegistros] = useState([]);
    const { addSnackbar } = useSnackbar();
    const [modulos, setModulos] = useState([]);
    const [moduloSelection, setModuloSelection] = useState({});
    const [roles, setRoles] = useState([]);
    const [selectedRol, setSelectedRol] = useState(null);

    useEffect(() => {
        obtenerRolesApi()
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedRol) {
            obtenerPermisosRolApi(selectedRol.id)
                .then(response => {
                    setModulos(response.data);
                    const selection = {};
                    response.data.forEach(modulo => {
                        selection[modulo.id] = modulo.assigned;
                    });
                    setModuloSelection(selection);
                })
                .catch(error => {
                    console.error('Error fetching modulos:', error);
                });
        } else {
            setModulos([]);
            setModuloSelection({});
        }
    }, [selectedRol]);

    const handleCheckboxChange = (id) => {
        setModuloSelection({
            ...moduloSelection,
            [id]: !moduloSelection[id],
        });
    };

    const handleSave = () => {
        const updatedModulos = modulos.map(modulo => ({
            moduloId: modulo.id,
            assigned: moduloSelection[modulo.id],
        }));
        actualizarPermisoApi(selectedRol.id, updatedModulos)
            .then(response => {
                addSnackbar("Registros actualizados correctamente", "success");
            })
            .catch(error => {
                if (error.message == 'Request failed with status code 401')
                    addSnackbar("La sesión ya caducó, vuelva a iniciar sesión", "error");
                else {
                    addSnackbar("Error al actualizar los registros", "error");
                }
            });
    };

    const columnas = [
        { field: 'id', headerName: 'Id', width: 100 },
        { field: 'nombre', headerName: 'Módulo', width: 200 },
        {
            field: 'assigned',
            headerName: 'Asignado',
            width: 150,
            renderCell: (params) => (
                <Checkbox
                    checked={moduloSelection[params.row.id] || false}
                    onChange={() => handleCheckboxChange(params.row.id)}
                />
            ),
        },
    ];

    return (
        <Box padding={1} sx={{ display: 'flex', justifyContent: 'center', border: 0, width: '75%' }} >
            <Cargando loading={cargando} />
            <Stack spacing={1} sx={{ width: '100%', border: 0 }} >
                <Item>
                    <Box sx={{ display: 'flex', border: 0 }} >
                        <Box padding={1} sx={{ display: 'flex', border: 0 }} >
                            <Typography variant="subtitle1"> Seleccionar el rol:</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', border: 0 }} >
                            <Autocomplete
                                options={roles}
                                getOptionLabel={(option) => option.nombre}
                                style={{ width: 300 }}
                                onChange={(event, newValue) => setSelectedRol(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Rol"
                                        fullWidth
                                        required
                                        size="small"
                                        InputLabelProps={{
                                            sx: redAsteriskStyle,
                                            shrink: true,
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                </Item>
                <Item>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0, height: 480 }}>
                        <DataGrid
                            rows={modulos}
                            columns={columnas}
                            density="compact"
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection={false}
                            localeText={localeText}
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    </Box>
                </Item>
                <Item>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0 }}>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            color="primary"
                            sx={{ margin: 0.3, height: 30 }}
                            onClick={handleSave}
                        >
                            Guardar
                        </Button>
                        <Button variant="contained" startIcon={<ExitToAppIcon />} sx={{ margin: 0.3, height: 30 }} onClick={salirModulo}>Salir</Button>
                    </Box>
                </Item>
            </Stack>
        </Box>
    );
}