import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Dashboard from './components/base/dashboard/Dashboard';
import Login from './components/base/dashboard/elementos/Login';
import { useAuth } from './components/api/security/AuthContext'
import AuthProvider from './components/api/security/AuthContext'
import PantallaModulos from './components/base/modulos/PantallaModulos';
import PantallaClientes from './components/entidades/clientes/PantallaClientes'
import Prueba1 from './components/x/Prueba1';
import Prueba2 from './components/x/Prueba2';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IconButton, } from "@mui/material";
import Alert from '@mui/material/Alert';
import { SnackbarProvider } from './components/base/dashboard/elementos/SnackbarContext';
import MultipleSnackbars from './components/base/dashboard/elementos/MultipleSnackbars';
import PantallaEmpleados from './components/entidades/empleados/PantallaEmpleados';
import PantallaPermisos from './components/base/permisos/PantallaPermisos';
import PantallaRoles from './components/base/roles/PantallaRoles';
import PantallaOperaciones from './components/base/operaciones/PantallaOperaciones';
import PantallaUsuarios from './components/base/usuarios/PantallaUsuarios'
import PantallaUbicaciones from './components/entidades/ubicaciones/PantallaUbicaciones'
import Escritorio from './components/base/dashboard/elementos/Escritorio';
import ErrorPage from './components/base/dashboard/elementos/ErrorPage';
import PantallaVendedores from './components/entidades/vendedores/PantallaVendedores';
import PantallaSupervisores from './components/entidades/supervisores/PantallaSupervisores';
import PantallaSucursales from './components/entidades/sucursales/PantallaSucursales';
import PantallaAtaudes from './components/entidades/ataudes/PantallaAtaudes';
import PantallaPlazosDePago from './components/entidades/plazosdepago/PantallaPlazosDePago';
import PantallaListasDePrecios from './components/entidades/listasdeprecios/PantallaListasDePrecios';
import PantallaPaquetes from './components/entidades/paquetes/PantallaPaquetes';
import PantallaJardines from './components/entidades/jardines/PantallaJardines';
import PantallaSolicitudes from './components/entidades/solicitudes/PantallaSolicitudes';

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Snackbar
        open={open}
        message="La sesión ya expiró. Redirigiendo a login..."
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
          >
            <AccessTimeIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          La sesión ya expiró. Redirigiendo a login...
        </Alert>
      </Snackbar>
      {isAuthenticated ? children : null}
    </>
  );
};


export default function App() {

  useEffect(() => {
    sessionStorage.setItem('nombreModulo', 'Inicio');
  }, []);

  const nombreApp = "PLA";

  return (
    <AuthProvider>
      <SnackbarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/logout" element={<AuthenticatedRoute><Login /></AuthenticatedRoute>} />
            <Route path="/inicio" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>}>
              <Route path="escritorio" element={<AuthenticatedRoute><Escritorio /></AuthenticatedRoute>} />
              <Route path="usuarios" element={<AuthenticatedRoute><PantallaUsuarios /></AuthenticatedRoute>} />
              <Route path="empleados" element={<AuthenticatedRoute><PantallaEmpleados /></AuthenticatedRoute>} />
              <Route path="permisos" element={<AuthenticatedRoute><PantallaPermisos /></AuthenticatedRoute>} />
              <Route path="roles" element={<AuthenticatedRoute><PantallaRoles /></AuthenticatedRoute>} />
              <Route path="operaciones" element={<AuthenticatedRoute><PantallaOperaciones /></AuthenticatedRoute>} />
              <Route path="modulos" element={<AuthenticatedRoute><PantallaModulos /></AuthenticatedRoute>} />
              <Route path="clientes" element={<AuthenticatedRoute><PantallaClientes /></AuthenticatedRoute>} />
              <Route path="vendedores" element={<AuthenticatedRoute><PantallaVendedores /></AuthenticatedRoute>} />
              <Route path="Sucursales" element={<AuthenticatedRoute><PantallaSucursales /></AuthenticatedRoute>} />
              <Route path="supervisores" element={<AuthenticatedRoute><PantallaSupervisores /></AuthenticatedRoute>} />
              <Route path="ataudes" element={<AuthenticatedRoute><PantallaAtaudes /></AuthenticatedRoute>} />
              <Route path="plazosdepago" element={<AuthenticatedRoute><PantallaPlazosDePago /></AuthenticatedRoute>} />
              <Route path="listasdeprecios" element={<AuthenticatedRoute><PantallaListasDePrecios /></AuthenticatedRoute>} />
              <Route path="ubicaciones" element={<AuthenticatedRoute><PantallaUbicaciones /></AuthenticatedRoute>} />
              <Route path="jardines" element={<AuthenticatedRoute><PantallaJardines /></AuthenticatedRoute>} />
              <Route path="paquetes" element={<AuthenticatedRoute><PantallaPaquetes /></AuthenticatedRoute>} />
              <Route path="Solicitudes" element={<AuthenticatedRoute><PantallaSolicitudes /></AuthenticatedRoute>} />
              <Route path="prueba1" element={<AuthenticatedRoute><Prueba1 /></AuthenticatedRoute>} />
              <Route path="prueba2" element={<AuthenticatedRoute><Prueba2 /></AuthenticatedRoute>} />
            </Route>
          </Routes>
        </Router>
        <MultipleSnackbars />
      </SnackbarProvider>
    </AuthProvider>
  );
}