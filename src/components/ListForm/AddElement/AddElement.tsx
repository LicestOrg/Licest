import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@contexts';
import { ElementType, PropertyValueType } from '@types';
import { Box, Button, MenuItem, Modal, Paper, TextField, Alert } from '@mui/material';

type AddElementProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  elements: ElementType[];
  loadElements: () => void;
  defaultProperties?: { type: PropertyValueType, name: string, required?: boolean }[];
};

function AddElement({ open, setOpen, loadElements, elements, defaultProperties = [] }: AddElementProps) {
  const { token } = useAuth();
  const { id } = useParams();

  const [nbProperties, setNbProperties] = useState(defaultProperties.length > 0 ? 0 : 1);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  function close(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
    setNbProperties(defaultProperties.length > 0 ? 0 : 1);
  }

  function addElement(event: React.FormEvent) {
    event.preventDefault();
    setAlert(false);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    let properties: { type: PropertyValueType, name: string, value: string }[] = [];
    if (elements.length == 0) {
      if (defaultProperties.length > 0) {
        properties = defaultProperties.map((key, index) => ({
          type: key.type,
          name: key.name,
          value: (data[`value-${index}`] as string).trim(),
        }));
      }

      Array.from({ length: nbProperties }, (_, index) => {
        properties.push({
          type: data[`type-${index}`] as PropertyValueType,
          name: (data[`name-${index}`] as string).trim(),
          value: (data[`value-${index}`] as string).trim(),
        });
      });
    } else {
      properties = elements[0].properties.map((key, index) => ({
        type: key.type,
        name: key.name,
        value: (data[`value-${index}`] as string).trim(),
      }));
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
        properties: properties
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

  return open ? (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
        <Box component="form" onSubmit={addElement} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {elements.length == 0 && defaultProperties.map((key, index) => (
            <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
              <TextField name={`value-${index}`} label={key.name} required={key.required} />
            </Box>
          ))}

          {elements.length == 0 && Array.from({ length: nbProperties }, (_, index) => (
            <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
              <TextField name={`name-${index}`} label="Name" required />
              <TextField name={`type-${index}`} label="Type" select defaultValue={PropertyValueType.STRING}>
                {Object.values(PropertyValueType).map((type, index) => (
                  <MenuItem key={index} value={type}>{type.charAt(0).toUpperCase() + type.toLowerCase().slice(1)}</MenuItem>
                ))}
              </TextField>
              <TextField name={`value-${index}`} label="Value" />
            </Box>
          ))}

          {elements.length > 0 && elements[0].properties.map((key, index) => (
            <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
              <TextField name={`value-${index}`} label={key.name} />
            </Box>
          ))}

          {elements.length == 0 && nbProperties < 10 - defaultProperties.length &&
            <Button onClick={() => setNbProperties(nbProperties + 1)}>Add Property</Button>
          }
          {elements.length == 0 && nbProperties > (defaultProperties.length > 0 ? 0 : 1) &&
            <Button onClick={() => setNbProperties(nbProperties - 1)}>Remove Property</Button>
          }

          {alert && <Alert severity="error">{alertMessage}</Alert>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Add Element
          </Button>
        </Box>
      </Paper>
    </Modal>
  ) : null;
}

export default AddElement;
