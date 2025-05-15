import Typography from '@mui/material/Typography';
import { Breadcrumbs, Link, } from '@mui/material';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

export default function Migasdepan({ rutas }) {
    return (
        <Box sx={{
            display: 'flex', border: 0, alignItems: 'center', '& .MuiBreadcrumbs-separator': {
                marginLeft: '3px',
                marginRight: '3px',
            }
        }}>
            <Breadcrumbs
                separator={<NavigateNextIcon sx={{ color: 'white', }} fontSize="small" />}
                aria-label="breadcrumb"
            >
                <LinkRouter
                    key="Home"
                    color="common.white"
                    to="http://localhost:3000"
                    underline="hover"
                >
                    <HomeIcon sx={{ color: 'white', mt: 0.8 }} fontSize="small" />
                </LinkRouter>
                {rutas.map((path, index) => {
                    const isLast = index === rutas.length - 1;
                    const pascalCaseName = path.name.split(/[\s-_]+/).map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join('');

                    return isLast ? (
                        <Typography key={path.name} color="common.white">
                            {pascalCaseName}
                        </Typography>
                    ) : (
                        <LinkRouter
                            key={path.name}
                            color="common.white"
                            to={path.href}
                            underline="hover"
                        >
                            {pascalCaseName}
                        </LinkRouter>
                    );
                })}
            </Breadcrumbs>
        </Box>
    );
}