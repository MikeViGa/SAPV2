import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Button, TextField, Typography, Container } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login'
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useAuth } from '../../../api/security/AuthContext'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Iconify from "./iconify";


export default function Login() {

    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState(false);
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const navigate = useNavigate()
    const authContext = useAuth()

    function handleUsernameChange(e) {
        setUsername(e.target.value);
        if (e.target.validity.valid) {
            setUsernameError(false);
        } else {
            setUsernameError(true);
        }
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPassword(e.target.value);
        if (e.target.validity.valid) {
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    }

    async function handleSubmit() {
        if (!username || !password) {
            setShowErrorMessage(true)
            return;
        } else {
            if (await authContext.login(username, password)) {
                sessionStorage.setItem('nombreUsuario', username);
                navigate(`/inicio/escritorio`)
            } else {
                setShowErrorMessage(true)
            }
        }
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <Container component="main" maxWidth="xs">
            <Box
                display="flex"
                flexDirection={"column"}
                justifyContent={"center"}
                margin="auto"
                marginTop={5}
                padding={1}
                borderRadius={2}
                boxShadow={"5px 5px 10px #ccc"}
                sx={{
                    ":hover": {
                        boxShadow: "10px 10 px 20 px #ccc"
                    },
                }}
                component="form" onSubmit={handleSubmit}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', border:0 }}>
                    <img src="../logo.png" alt="Login" style={{ width: '80%', height: '80%' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0, justifyContent: 'center', }} >
                    <Stack>
                        <TextField fullWidth variant="filled"  sx={{ margin: 2 }} required type={"text"} name="username" error={usernameError} label="Usuario" value={username} 
                        helperText={
                            usernameError ? "Ingrese su nombre de usuario" : ""
                        } 
                        onChange={handleUsernameChange}
                        InputLabelProps={{ shrink: true }} />

                        <TextField fullWidth variant="filled"  sx={{ margin: 2 }} required name="password" label="Contraseña" value={password} error={passwordError}
                            type={showPassword ? 'text' : 'password'}
                            helperText={passwordError ? "Ingrese su contraseña" : ""}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handlePasswordChange}
                            InputLabelProps={{ shrink: true }} />
                        <Typography color="error" sx={{ margin: 2,  }}>{showErrorMessage && <div className="errorMessage"> Usuario o contraseña incorrectos</div>}</Typography>
                        <Box sx={{ display: 'flex', gap: 0, justifyContent: 'center', }} >
                            <Button sx={{ margin: 2 }} variant="contained" startIcon={<LoginIcon />} name="login" onClick={handleSubmit}>Ingresar</Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Container>
    )
}