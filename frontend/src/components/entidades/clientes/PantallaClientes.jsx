import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material';
import { obtenerClienteNombreApi, obtenerClienteApi, obtenerClientesApi } from '../../api/ClienteApiService';
import ListarClientes from './ListarClientes';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Item, ScreenWrapper, ExitButton, useScreenCommon, redAsteriskStyle } from '../../base/common/CommonControls';

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
                sx={{ margin: 0.6, height: 30, width: 130 }}
                onClick={onShow}
            >
                Mostrar
            </Button>
        </Box>
    </Box>
);

export default function PantallaClientes() {

    const {
        cargando,
        setCargando,
        registros,
        setRegistros,
        salirModulo,
        addSnackbar
    } = useScreenCommon('Clientes', async (setRegistros, setCargando, addSnackbar) => {
        try {
            setCargando(true);
            const response = await obtenerClientesApi();
            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            setRegistros(Array.isArray(data) ? data : []);
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

    const obtenerOpciones = async (consulta) => {
        try {
            const respuesta = await obtenerClienteNombreApi(consulta);
            setOpciones(respuesta.data);
        } catch (error) {
            addSnackbar("Error al obtener las opciones de búsqueda", "error");
        }
    };

    const mostrarRegistros = async () => {
        setCargando(true);
        try {
            if (idRegistro) {
                const respuesta = await obtenerClienteApi(idRegistro);
                const detalle = typeof respuesta.data === 'string' ? JSON.parse(respuesta.data) : respuesta.data;
                setRegistros(detalle ? [detalle] : []);
            } else {
                const respuesta = await obtenerClientesApi();
                const lista = typeof respuesta.data === 'string' ? JSON.parse(respuesta.data) : respuesta.data;
                setRegistros(Array.isArray(lista) ? lista : []);
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
                <SearchBox
                    opciones={opciones}
                    onSearch={obtenerOpciones}
                    onChange={setIdRegistro}
                    onShow={mostrarRegistros}
                />
            </Item>
            <Item>
                <ListarClientes refrescar={mostrarRegistros} regs={registros} />
            </Item>
            <ExitButton onClick={salirModulo} />
        </ScreenWrapper>
    );
}