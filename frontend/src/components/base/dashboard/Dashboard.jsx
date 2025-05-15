import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, useMediaQuery, ThemeProvider } from '@mui/material';
import DerechosReservados from './elementos/Footer'
import MenuLateral from './MenuLateral';
import MenuPerfil from './MenuPerfil';
import Migasdepan from './Migasdepan';
import { Grid, Tooltip } from '@mui/material';

export default function Dashboard(props) {

  const location = useLocation();
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [nombreModulo, setNombreModulo] = useState('');

  //*********************INICIA SESION
  useEffect(() => {
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
      setNombreUsuario(nombreUsuario);
    }
  }, []);

  useEffect(() => {
    setNombreModulo(location.pathname);
    tokenizeAndTransform(location.pathname);
  }, [location]);

  //FIN SESION

  //*********************INICIA ILUMINACIÓN
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  //FIN ILUMINACIÓN


  //*********************************INICIA MENU PERFIL
  const [anchorElMenuPerfil, setAnchorElMenuPerfil] = React.useState(null);
  const abreMenuPerfil = (event) => {
    setAnchorElMenuPerfil(event.currentTarget);
  };

  const manejaCierreMenuPerfil = () => {
    setAnchorElMenuPerfil(null);
  };
  //*********************************FIN MENU PERFIL

  //*********************************INICIA BLOQUEO NAVEGACION
  useEffect(() => {
    const handlePopState = () => { // Prevent back and forward navigation
      window.history.pushState(null, '', window.location.href);
    };
    const handleBeforeUnload = (event) => { // Prevent refresh and navigation away
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave? Unsaved changes might be lost........';
    };
    const handleHomeButton = (event) => { // Prevent home button click
      event.preventDefault();
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'F5' || event.key === 'Refresh') {
        event.preventDefault();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Home') {
        event.preventDefault();
      }
    });
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleHomeButton);
    };
  }, []);
  //*********************************FIN BLOQUEO NAVEGACION
  const [open, setOpen] = React.useState(true);
  const [leftOffset, setLeftOffset] = useState(0);

  const [estaMenuLateralAbierto, setEstaMenuLateralAbierto] = useState(false);

  function manejaMenuLateralAbierto() {
    setEstaMenuLateralAbierto(true);
  }

  const [ruta, setRuta] = useState([{ name: 'Inicio', href: '/inicio' },]);

  function tokenizeAndTransform1(inputString) {
    if (!inputString || inputString.trim() === '') {
      return [];
    }
    const cleanedInput = inputString.trim().replace(/^\/+|\/+$/g, '');
    if (cleanedInput === '') {
      return [{ name: 'Home', href: '/' }];
    }
    const tokens = cleanedInput.split('/');
    const paths = tokens.reduce((acc, token, index) => {
      if (index === 0) {
        acc.push({ name: 'Home', href: '/' });
      }
      if (index === tokens.length - 1) {
        acc.push({ name: token });
      } else {
        const href = '/' + tokens.slice(0, index + 1).join('/');
        acc.push({ name: token, href: href });
      }
      return acc;
    }, []);
    setRuta(paths);
  }

  function tokenizeAndTransform(inputString) {
    if (!inputString || inputString.trim() === '') {
      return [];
    }
    const cleanedInput = inputString.trim().replace(/^\/+|\/+$/g, '');
    if (cleanedInput === '') {
      return [{ name: 'Inicio', href: '/inicio/escritorio' }];
    }
    const tokens = cleanedInput.split('/');
    const paths = tokens.reduce((acc, token, index) => {
      if (index === tokens.length - 1) {
         acc.push({ name: token });
      } else {
        const href = '/' + tokens.slice(0, index + 1).join('/');
        if (token == 'inicio')
          acc.push({ name: token, href: "/inicio/escritorio" });
        else
          acc.push({ name: token, href: href });
      }
      return acc;
    }, []);

   setRuta(paths);
   return paths;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ border: 0 }}>
        <AppBar
          position="fixed"
          open={open}
          sx={{
            pr: '0px',
            zIndex: theme.zIndex.drawer + 1,
          }}>
          <Toolbar
            sx={{
              pr: '0px',
            }}>
            <Grid container alignItems="center" sx={{ border: 0 }}>
              <Grid item xs={0} sx={{ border: 0 }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={manejaMenuLateralAbierto}
                  sx={{
                    marginRight: '36px',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10} sx={{  border: 0}}>
                <Migasdepan rutas={ruta} />
              </Grid>
              <Grid item xs={1} sx={{  border: 0, display: 'flex', justifyContent: 'flex-end'  }}>
                <Box padding={0} sx={{ display: 'flex', border: 0 }} >
                  <Typography variant="subtitle1"> Hola {nombreUsuario}</Typography>
                  <Tooltip title="Configuración">
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      onClick={abreMenuPerfil}
                      color="inherit"
                      sx={{mt:-.3, ml:1}}
                    ><AccountCircle />
                    </IconButton>
                  </Tooltip>
                  <MenuPerfil
                    anchorElMenu={anchorElMenuPerfil}
                    manejaCierreMenu={manejaCierreMenuPerfil}
                    toggleColor={toggleColorMode}
                    modo={mode} />
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <MenuLateral menuLateral={estaMenuLateralAbierto} manejaMenuLateral={manejaMenuLateralAbierto} />
        <Box sx={{ border: 0, mt: 8, width: '100%', display: 'flex', justifyContent: 'center' }} >
          <Outlet />
        </Box>
        <DerechosReservados />
      </Box>
    </ThemeProvider>
  );
}