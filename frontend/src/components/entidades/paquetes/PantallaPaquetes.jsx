import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { obtenerPaqueteDescripcionApi, obtenerPaqueteApi, obtenerPaquetesApi, obtenerPaquetesTodosApi } from '../../api/PaqueteApiService';
import ListarPaquetes from './ListarPaquetes';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Item, ScreenWrapper, ExitButton, useScreenCommon, redAsteriskStyle } from '../../base/common/CommonControls';

const SearchBox = ({ opciones, onSearch, onChange, onShow }) => (
    <Box sx={{ display: 'flex' }}>
        <Box padding={1}>
            <Typography variant="subtitle1">Filtrar por descripcion:</Typography>
        </Box>
        <Box>
            <Autocomplete
                freeSolo
                options={opciones}
                getOptionLabel={(opcion) =>
                    typeof opcion === 'string' ? opcion : `${opcion.descripcion} (ID: ${opcion.id})`
                }
                onInputChange={(event, nuevoValor) => {
                    if (nuevoValor.length >= 3) {
                        onSearch(nuevoValor);
                    }
                }}
                onChange={(event, nuevoValor) => {
                    onChange(nuevoValor && typeof nuevoValor === 'object' ? nuevoValor.id : null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Descripcion"
                        fullWidth
                        required
                        style={{ width: '400px' }}
                        size="small"
                        InputLabelProps={{
                            sx: redAsteriskStyle,
                            shrink: true,
                        }}
                    />
                )}
                renderOption={(props, opcion) => (
                    <li {...props} key={opcion.id}>
                        {opcion.descripcion} (ID: {opcion.id})
                    </li>
                )}
            />
        </Box>
        <Box>
            <Button 
                variant="contained" 
                startIcon={<ManageSearchIcon />} 
                sx={{ margin: 0.6, height: 30, width: 130 }} 
                onClick={onShow}
            >
                Mostrar
            </Button>
        </Box>
    </Box>
);


export default function PantallaPaquetes() {

    const { 
            cargando, 
            setCargando, 
            registros, 
            setRegistros, 
            salirModulo, 
            addSnackbar 
        } = useScreenCommon('Paquetes', async (setRegistros, setCargando, addSnackbar) => {
            try {
                setCargando(true);
                const response = await obtenerPaquetesApi();
                setRegistros(response.data);
                addSnackbar("Registros cargados exitosamente", "success");
            } catch (error) {
                if (error.message == 'Request failed with status code 401')
                    addSnackbar("La sesión ya caducó, vuelva a iniciar sesión", "error");
                else {
                    addSnackbar("Error al cargar los registros iniciales", "error");
                }
            } finally {
                setCargando(false);
            }
        });
    
        const [idRegistro, setIdRegistro] = useState(null);
        const [opciones, setOpciones] = useState([]);
        const [mostrarInactivos, setMostrarInactivos] = useState(false);
    
        const obtenerOpciones = async (consulta) => {
            try {
                const respuesta = await obtenerPaqueteDescripcionApi(consulta);
                setOpciones(respuesta.data);
            } catch (error) {
                addSnackbar("Error al obtener las opciones de búsqueda", "error");
            }
        };
    
        const mostrarRegistros = async () => {
            setCargando(true);
            try {
                if (idRegistro) {
                    const respuesta = await obtenerPaqueteApi(idRegistro);
                    setRegistros([respuesta.data]);
                } else {
                    const respuesta = mostrarInactivos ? await obtenerPaquetesTodosApi() : await obtenerPaquetesApi();
                    setRegistros(respuesta.data);
                }
                addSnackbar("Registros actualizados correctamente", "success");
            } catch (error) {
                if (error.message == 'Request failed with status code 401')
                    addSnackbar("La sesión ya caducó, vuelva a iniciar sesión", "error");
                else {
                    addSnackbar("Error al actualizar los registros", "error");
                }
            } finally {
                setCargando(false);
            }
        };
    
        return (
            <ScreenWrapper loading={cargando}>
                <Item>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={mostrarInactivos}
                                    onChange={(e) => {
                                        setMostrarInactivos(e.target.checked);
                                        // Auto-refrescar cuando cambie el toggle
                                        setTimeout(() => mostrarRegistros(), 100);
                                    }}
                                    name="mostrarInactivos"
                                />
                            }
                            label="Mostrar paquetes inactivos"
                        />
                    </Box>
                </Item>
                <Item>
                    <ListarPaquetes refrescar={mostrarRegistros} regs={registros} />
                </Item>
                <ExitButton onClick={salirModulo} />
            </ScreenWrapper>
        );
}