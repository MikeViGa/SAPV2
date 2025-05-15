import React from 'react';
import { obtenerRolesApi } from '../../api/RolApiService';
import ListarRoles from './ListarRoles';
import { Item, ScreenWrapper, ExitButton, useScreenCommon } from '../common/CommonControls';

export default function PantallaRoles() {
    const { 
        cargando, 
        setCargando,  
        registros, 
        setRegistros, 
        salirModulo, 
        addSnackbar 
    } = useScreenCommon('Roles', async (setRegistros, setCargando, addSnackbar) => {
        try {
            setCargando(true);
            const response = await obtenerRolesApi();
            setRegistros(response.data);
            addSnackbar("Registros actualizados correctamente", "success");
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

    const mostrarRegistros = async () => {
        setCargando(true);
        try {
            const respuesta = await obtenerRolesApi();
            setRegistros(respuesta.data);
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
                <ListarRoles refrescar={mostrarRegistros} regs={registros} />
            </Item>
            <ExitButton onClick={salirModulo} />
        </ScreenWrapper>
    );
}