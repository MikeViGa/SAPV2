import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material';
import { obtenerModuloApi, obtenerModulosApi } from '../../api/ModuloApiService';
import ListarModulos from './ListarModulos';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Item, ScreenWrapper, ExitButton, useScreenCommon, redAsteriskStyle } from '../common/CommonControls';

const SearchBox = ({ opciones, onSearch, onChange, onShow }) => (
    <Box sx={{ display: 'flex' }}>
        <Box padding={1}>
            <Typography variant="subtitle1">Filtrar por nombre:</Typography>
        </Box>
        <Box>
            <Autocomplete
                freeSolo
                options={opciones}
                getOptionLabel={(opcion) =>
                    typeof opcion === 'string' ? opcion : `${opcion.nombre} (ID: ${opcion.id})`
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
                        label="Nombre"
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
                        {opcion.nombre} (ID: {opcion.id})
                    </li>
                )}
            />
        </Box>
        <Box>
            <Button
                variant="contained"
                startIcon={<ManageSearchIcon />}
                sx={{ margin: 0.2, height: 30, width: 130 }}
                onClick={onShow}
            >
                Mostrar
            </Button>
        </Box>
    </Box>
);

export default function PantallaModulos() {

    const {
        cargando,
        setCargando,
        registros,
        setRegistros,
        salirModulo,
        addSnackbar
    } = useScreenCommon('Modulos', async (setRegistros, setCargando, addSnackbar) => {
        try {
            setCargando(true);
            const response = await obtenerModulosApi();
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



    const mostrarRegistros = async () => {
        setCargando(true);
        try {
            if (idRegistro) {
                const respuesta = await obtenerModuloApi(idRegistro);
                setRegistros([respuesta.data]);
            } else {
                const respuesta = await obtenerModulosApi();
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
                <ListarModulos refrescar={mostrarRegistros} regs={registros} />
            </Item>

            <ExitButton onClick={salirModulo} />
        </ScreenWrapper>
    );
}