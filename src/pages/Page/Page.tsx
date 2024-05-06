import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import ElementType from '../../types/ElementType';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import {
  Button,
  Modal,
  Paper,
  Box,
  TextField,
  Alert,
} from '@mui/material';

function Pages() {
  const { token } = useAuth();
  const { user } = useUser();

  const [elements, setElements] = useState<unknown[]>([]);
  const [open, setOpen] = useState(false);

  const [nbProperties, setNbProperties] = useState(1);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { id } = useParams();

  function loadElements() {
    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/elements/page/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setElements(data.length > 0 ? data.map((element: ElementType, index: number) => {
          const properties: unknown = { uid: element.id, id: index + 1 };
          element.properties.forEach((property: unknown) => {
            properties[property.name] = property.value;
          });
          return properties;
        }) : []);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    loadElements();
  }, [user]);

  function closeModal(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
    setNbProperties(1);
  }

  function addElement(event: React.FormEvent) {
    event.preventDefault();
    setAlert(false);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/elements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        pageId: id,
        name: 'Element',
        properties: Array.from({ length: nbProperties }, (_, index) => ({
          type: 'STRING',
          name: data[`name${index}`],
          value: data[`value${index}`],
        })),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 201) {
          setAlert(true);
          setAlertMessage(data.message);
          return;
        }

        closeModal(event);
        loadElements();
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  }

  function deleteElement(params: { row: { id: number } }) {
    console.log(token);
    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/elements/${elements[params.row.id - 1].uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 200)
          return;
        loadElements();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function getKeys() {
    const keys = [
      ...(elements.length > 0
        ? Object.keys(elements[0]).map((key) => ({
          field: key,
          headerName: key,
        }))
        : []),
      {
        field: 'delete',
        headerName: '',
        sortable: false,
        renderCell: (params) => (
          <Delete onClick={() => deleteElement(params)} />
        ),
      },
    ];
    delete keys[0];

    return keys;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Element</Button>
      <DataGrid
        rows={elements}
        columns={getKeys()}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
      />
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
          <Box component="form" onSubmit={addElement} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: nbProperties }, (_, index) => (
              <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
                <TextField name={`name${index}`} label="Name" />
                <TextField name={`value${index}`} label="Value" />
              </Box>
            ))}
            {nbProperties < 10 && <Button onClick={() => setNbProperties(nbProperties + 1)}>Add Property</Button>}
            {alert && <Alert severity="error">{alertMessage}</Alert>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Add Element
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}

export default Pages;
