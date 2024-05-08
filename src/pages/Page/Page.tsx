import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import ElementType from '../../types/ElementType';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
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

  const [elements, setElements] = useState<object[]>([]);
  const [openModalAddElement, setOpenModalAddElement] = useState(false);
  const [openModalEditElement, setOpenModalEditElement] = useState(false);

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
          const properties: object = { uid: element.id, id: index + 1 };
          element.properties.forEach((property) => {
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

  function closeModalAddElement(event: React.FormEvent) {
    event.preventDefault();
    setOpenModalAddElement(false);
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
        properties: (elements.length == 0 ? Array.from({ length: nbProperties }, (_, index) => ({
          type: 'STRING',
          name: data[`name${index}`],
          value: data[`value${index}`],
        })) : Object.keys(elements[0]).slice(2).map((key, index) => ({
          type: 'STRING',
          name: key,
          value: data[`value${index}`],
        }))),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 201) {
          setAlert(true);
          setAlertMessage(data.message);
          return;
        }

        closeModalAddElement(event);
        loadElements();
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  }

  function closeModalEditElement(event: React.FormEvent) {
    event.preventDefault();
    setOpenModalEditElement(false);
  }

  function editElement(event: React.FormEvent) {
    event.preventDefault();
    setAlert(false);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/elements/${elements[0].uid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        properties: Object.keys(elements[0]).slice(2).map((key, index) => ({
          type: 'STRING',
          name: key,
          value: data[`value${index}`],
        })),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 200) {
          setAlert(true);
          setAlertMessage(data.message);
          return;
        }

        closeModalEditElement(event);
        loadElements();
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  }

  function deleteElement(params: { row: { id: number } }) {
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
        field: 'edit',
        headerName: '',
        width: 1,
        sortable: false,
        renderCell: () => (
          <Edit onClick = {() => setOpenModalEditElement(true)} />
        ),
      },
      {
        field: 'delete',
        headerName: '',
        width: 1,
        sortable: false,
        renderCell: (params: { row: { id: number } }) => (
          <Delete onClick={() => deleteElement(params)} />
        ),
      },
    ];
    delete keys[0];

    return keys;
  }

  return (
    <>
      <Button onClick={() => setOpenModalAddElement(true)}>Add Element</Button>
      {elements.length > 0 && (
        <DataGrid
          rows={elements}
          columns={getKeys()}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      )}
      <Modal
        open={openModalAddElement}
        onClose={closeModalAddElement}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
          <Box component="form" onSubmit={addElement} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {elements.length == 0 && Array.from({ length: nbProperties }, (_, index) => (
              <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
                <TextField name={`name${index}`} label="Name" />
                <TextField name={`value${index}`} label="Value" />
              </Box>
            )) || Object.keys(elements[0]).slice(2).map((key, index) => (
              <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
                <TextField name={`value${index}`} label={key} />
              </Box>
            ))}

            {elements.length == 0 && nbProperties < 10 && <Button onClick={() => setNbProperties(nbProperties + 1)}>Add Property</Button>}
            {elements.length == 0 && nbProperties > 1 && <Button onClick={() => setNbProperties(nbProperties - 1)}>Remove Property</Button>}
            {alert && <Alert severity="error">{alertMessage}</Alert>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Add Element
            </Button>
          </Box>
        </Paper>
      </Modal>
      {elements.length > 0 && (
        <Modal
          open={openModalEditElement}
          onClose={closeModalEditElement}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
            <Box component="form" onSubmit={editElement} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.keys(elements[0]).slice(2).map((key, index) => (
                <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
                  <TextField name={`value${index}`} label={key} />
                </Box>
              ))}
              {alert && <Alert severity="error">{alertMessage}</Alert>}
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Edit Element
              </Button>
            </Box>
          </Paper>
        </Modal>
      )}
    </>
  );
}

export default Pages;
