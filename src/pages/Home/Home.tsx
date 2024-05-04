import { useAuth } from '../../context/AuthContext';
import {
  Button,
  Container,
  CssBaseline,
  Grid,
} from '@mui/material';


function Home() {
  const { setToken } = useAuth();
  function handleLogout() {
    setToken();
  }

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
        <Button
          href="/"
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
        Logout
        </Button>
      </Grid>
    </Container>
  );
}

export default Home;
