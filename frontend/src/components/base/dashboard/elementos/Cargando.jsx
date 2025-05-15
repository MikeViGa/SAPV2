import { Backdrop } from '@mui/material';
import logoheartbeat from '../imagenes/logoheartbeat.gif'

export default function Cargando(props) {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
            open={props.loading}
        >
            <img src={logoheartbeat} style={{ width: 100, height: 100 }} />
        </Backdrop>
    );
};