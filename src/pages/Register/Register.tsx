import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Licest from '/licest.svg';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

function Register() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { setUser } = useUser();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setAlert(true);
      setAlertMessage('Passwords do not match');
      return;
    }

    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        tag: data.tag,
        password: data.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 201) {
          setAlert(true);
          setAlertMessage(data.message);
          return;
        }

        setUser({
          id: data.id,
          tag: data.tag,
          email: data.email,
          name: data.name,
        });
        setToken(data.access_token);
        navigate('/', { replace: true });
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  }

  return (
    <Container component="main" maxWidth="xs">
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
                Register
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
            id="name"
            label="Username"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="tag"
            label="@tag"
            name="tag"
            autoComplete="tag"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
          />
          {alert ? <Alert severity="error">{alertMessage}</Alert> : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
              Register
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/login" variant="body2">
                {'Already have an account? Sign In'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default Register;
