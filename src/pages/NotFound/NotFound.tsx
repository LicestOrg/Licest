import {
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
} from '@mui/material';

function NotFound() {
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
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Typography component="h1" variant="h1">
              404
            </Typography>
          </Grid>
          <Grid item>
            <Typography component="h1" variant="h5">
              Not Found
            </Typography>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              href="/"
              variant="contained"
              color="primary"
            >
              Go to Home
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NotFound;
