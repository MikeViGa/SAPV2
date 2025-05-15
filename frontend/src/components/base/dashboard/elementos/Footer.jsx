import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Footer(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Derechos Reservados © '}
            <Link color="inherit" href="https://panteonlosangeles.mx/">
                Panteón Los Ángeles
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}