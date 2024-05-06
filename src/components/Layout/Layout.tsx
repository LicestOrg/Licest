import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { Home, Add, Logout } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import PageType from '../../types/PageType';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Box,
  TextField,
  Alert,
} from '@mui/material';

function Layout({ children }: { children: React.ReactNode }) {
  const { token, setToken } = useAuth();
  const { user } = useUser();

  const [page, setPage] = useState<PageType[]>([]);
  const [open, setOpen] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  function loadPages() {
    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/pages/user/${user?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setPage(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function addPage(event: React.FormEvent) {
    event.preventDefault();
    setAlert(false);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (!data.title) {
      setAlert(true);
      setAlertMessage('Title cannot be empty');
      return;
    }

    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ownerId: user?.id,
        title: data.title,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 201) {
          setAlert(true);
          setAlertMessage(data.message);
          return;
        }

        loadPages();
        setOpen(false);
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper elevation={0}>
            <List style={{ height: '100vh', padding: 0, borderRight: '1px solid #ccc' }}>
              <ListItemButton component={Link} key="home" href="/">
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
              {page.map((page) => (
                <ListItemButton component={Link} key={page.id} href={`/page/${page.id}`}>
                  <ListItemText primary={page.title} />
                </ListItemButton>
              ))}
              <ListItemButton key="add-page" onClick={() => setOpen(true)}>
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <ListItemText primary="Add Page" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={9} style={{ padding: 10 }}>
          <Grid item style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Paper elevation={0}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Licest</Typography>
                <Button onClick={() => setToken()} variant="contained">
                  <Logout />
                </Button>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={0}>
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="add-page"
        aria-describedby="add-page"
      >
        <Paper style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 10, width: 300 }}>
          <Box component="form" onSubmit={addPage} noValidate>
            <Typography variant="h6" id="modal-modal-title">
              Add Page
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              autoFocus
            />
            {alert && <Alert severity="error">{alertMessage}</Alert>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Add Page
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}

export default Layout;
