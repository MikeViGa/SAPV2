import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material';
import { obtenerVendedorNombreApi, obtenerVendedorApi, obtenerVendedoresApi } from '../../api/VendedorApiService';
import ListarVendedores from './ListarVendedores';
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

export default function PantallaVendedores() {

    const {
        cargando,
        setCargando,
        registros,
        setRegistros,
        salirModulo,
        addSnackbar
    } = useScreenCommon('Vendedores', async (setRegistros, setCargando, addSnackbar) => {
        try {
            setCargando(true);
            const response = await obtenerVendedoresApi();
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

    const obtenerOpciones = async (consulta) => {
        try {
            const respuesta = await obtenerVendedorNombreApi(consulta);
            setOpciones(respuesta.data);
        } catch (error) {
            addSnackbar("Error al obtener las opciones de búsqueda", "error");
        }
    };

    const mostrarRegistros = async () => {
        setCargando(true);
        try {
            if (idRegistro) {
                const respuesta = await obtenerVendedorApi(idRegistro);
                setRegistros([respuesta.data]);
            } else {
                const respuesta = await obtenerVendedoresApi();
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
                <SearchBox
                    opciones={opciones}
                    onSearch={obtenerOpciones}
                    onChange={setIdRegistro}
                    onShow={mostrarRegistros}
                />
            </Item>
            <Item>
                <ListarVendedores refrescar={mostrarRegistros} regs={registros} />
            </Item>
            <ExitButton onClick={salirModulo} />
        </ScreenWrapper>
    );
}