import ButtonLogout from './ButtonLogout';
import {
  Container,
  CssBaseline,
  Grid,
} from '@mui/material';

function Home() {
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
        <ButtonLogout />
      </Grid>
    </Container>
  );
}

export default Home;
