import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import ListarOperaciones from './ListarOperaciones';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { obtenerOperacionNombreApi, obtenerOperacionApi, obtenerOperacionesApi } from '../../api/OperacionApiService';
import { Button, Box,  } from "@mui/material";
import Cargando from '../dashboard/elementos/Cargando';
import { useSnackbar } from '../dashboard/elementos/SnackbarContext';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

const ItemGrid = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    color: theme.palette.text.secondary,
}));

const redAsteriskStyle = {
    '& .MuiInputLabel-asterisk': {
        color: 'red',
    },
};

export default function PantallaOperaciones() {

    /////////// INICIA GLOBALES
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('nombreModulo', 'Operaciones'); //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
    }, []);
    const navigate = useNavigate();
    const salirModulo = () => {
        navigate("/inicio/escritorio")
    };
    /////////// FIN GLOBALES

    /////////// INICIA AUTOCOMPLETAR
    const [idRegistro, setIdRegistro] = useState(null);
    const [opciones, setOpciones] = useState([]);
    
    function obtenerOpciones (consulta)  {
        obtenerOperacionNombreApi(consulta)  //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
            .then(respuesta => {
                setOpciones(respuesta.data);
            }).catch(error => {
                console.error("Error obteniendo registros:", error);
            });
    }

    function mostrarRegistros() {
        if (idRegistro) {
            setCargando(true);
            obtenerOperacionApi(idRegistro)     //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
                .then(respuesta => {
                    setRegistros(Array(respuesta.data));
                    addSnackbar("Registros actualizados correctamente", "success" );
                    setCargando(false);
                }).catch(error => {
                    console.log(error);
                    if (error.message == 'Request failed with status code 401')
                        addSnackbar("La sesión ya caducó, vuelva a iniciar sesión", "error");
                    else {
                        addSnackbar("Error al actualizar los registros", "error");
                    }
                });
        }
        else {
            referescarRegistros();
        }
    }
    /////////// FIN AUTOCOMPLETAR

    /////////// INICIA TABLA REGISTROS
    const [registros, setRegistros] = useState([]);
    
    useEffect(() => {
        (async () => {
            try {
                await referescarRegistros();
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    
    const referescarRegistros = (param) => {
        setCargando(true);
        return obtenerOperacionesApi()   //****SUSTITUIR CODIGO DE OTRAS ENTIDADES
            .then(respuesta => {
                setRegistros(respuesta.data);
                addSnackbar("Registros actualizados correctamente", "success" );
                setCargando(false);
            }).catch(error => {
                console.log(error);
                if (error.message == 'Request failed with status code 401')
                    addSnackbar("La sesión ya caducó, vuelva a iniciar sesión", "error");
                else {
                    addSnackbar("Error al actualizar los registros", "error");
                }
            });
    };
    /////////// FIN TABLA REGISTROS

    /////////// INICIO SNACKBAR
    const { addSnackbar } = useSnackbar();
    /////////// FIN SNACKBAR

    return (
        <Box padding={1} sx={{ display: 'flex', justifyContent: 'center', border: 0, width: '70%' }} >
            <Cargando loading={cargando} />
            <Stack spacing={1} sx={{ width: '100%', border: 0 }} >
                <Item>
                    <ListarOperaciones refrescar={mostrarRegistros} regs={registros} />
                </Item>
                <Item>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end',}}>
                        <Button variant="contained" startIcon={<ExitToAppIcon />} sx={{ margin: 0.3, height: 30 }} onClick={salirModulo}>Salir</Button>
                    </Box>
                </Item>
            </Stack>
        </Box>
    );
}