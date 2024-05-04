import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Licest from '/licest.svg';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 200) {
          setAlert(true);
          setAlertMessage(
            data.statusCode === 401
              ? 'Invalid email or password'
              : data.message,
          );
          return;
        }

        setToken(data.access_token);
        navigate('/', { replace: true });
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <img src={Licest} alt="Licest" width="50" height="50" />
          </Grid>
          <Grid item>
            <Typography component="h1" variant="h5">
                Login
            </Typography>
          </Grid>
        </Grid>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {alert ? <Alert severity="error">{alertMessage}</Alert> : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
              Login
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/register" variant="body2">
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default Login;
