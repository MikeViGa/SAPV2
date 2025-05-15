import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

export default function MenuPerfil({ anchorElMenu, manejaCierreMenu, toggleColor, modo }) {

    const navigate = useNavigate();
    const salirAplicacion = () => {
        const confirm = window.confirm('Está seguro de cerrar sesión?');
        if (confirm) {
            navigate("/logout")
        }
    };

    return (
        <Menu
            id="menu-appbar"
            anchorEl={anchorElMenu}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorElMenu)}
            onClose={manejaCierreMenu}
            sx={{ mt: '45px' }}
        >
            <MenuItem >
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <Typography variant="inherit">Perfil</Typography>
            </MenuItem>
            <MenuItem onClick={toggleColor}>
                <ListItemIcon>
                    {modo === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </ListItemIcon>
                <Typography variant="inherit">Iluminación</Typography>
            </MenuItem>
            <MenuItem onClick={salirAplicacion}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <Typography variant="inherit">Salir</Typography>
            </MenuItem>
        </Menu>
    );
}