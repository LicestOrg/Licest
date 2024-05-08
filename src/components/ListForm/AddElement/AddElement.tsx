import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@contexts';
import { PropertyType } from '@types';
import { Box, Button, MenuItem, Modal, Paper, TextField, Alert } from '@mui/material';

type AddElementProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  elements: object[];
  loadElements: () => void;
};

function AddElement({ open, setOpen, loadElements, elements }: AddElementProps) {

  const { token } = useAuth();
  const { id } = useParams();

  const [nbProperties, setNbProperties] = useState(1);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  function close(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
    setNbProperties(1);
  }

  function addElement(event: React.FormEvent) {
    event.preventDefault();
    setAlert(false);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (elements.length == 0)
      for (let index = 0; index < nbProperties; index++)
        if (!data[`name-${index}`]) {
          setAlert(true);
          setAlertMessage('Name is required');
          return;
        }

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
          type: data[`type-${index}`],
          name: data[`name-${index}`],
          value: data[`value-${index}`],
        })) : Object.keys(elements[0]).slice(2).filter(key => !key.startsWith('type-')).map((key, index) => ({
          type: elements[0][`type-${index}`],
          name: key,
          value: data[`value-${index}`],
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

        close(event);
        loadElements();
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  }

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
        <Box component="form" onSubmit={addElement} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {elements.length == 0 && Array.from({ length: nbProperties }, (_, index) => (
            <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
              <TextField name={`name-${index}`} label="Name" />
              <TextField name={`type-${index}`} label="Type" select defaultValue={PropertyType.STRING}>
                {Object.values(PropertyType).map((type, index) => (
                  <MenuItem key={index} value={type}>{type.charAt(0).toUpperCase() + type.toLowerCase().slice(1)}</MenuItem>
                ))}
              </TextField>
              <TextField name={`value-${index}`} label="Value" />
            </Box>
          )) || Object.keys(elements[0] as object).slice(2).filter(key => !key.startsWith('type-')).map((key, index) => (
            <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
              <TextField name={`value-${index}`} label={key} />
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
  );
}

export default AddElement;
