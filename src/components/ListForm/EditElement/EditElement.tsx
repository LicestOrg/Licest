import { useState } from 'react';
import { useAuth } from '@contexts';
import { Box, Button, Modal, Paper, TextField, Alert } from '@mui/material';

type EditElementProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  elements: object[];
  loadElements: () => void;
  selectedElement: object;
};

function EditElement({ open, setOpen, loadElements, elements, selectedElement  }: EditElementProps) {

  const { token } = useAuth();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  function close(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
  }

  function editElement(event: React.FormEvent) {
    event.preventDefault();
    setAlert(false);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/elements/${selectedElement.uid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        properties: Object.keys(elements[0]).slice(2).filter(key => !key.startsWith('type-')).map((key, index) => ({
          type: elements[0][`type-${index}`],
          name: key,
          value: data[`value-${index}`],
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

        close(event);
        loadElements();
      })
      .catch((error) => {
        setAlert(true);
        setAlertMessage(error.message);
      });
  }

  return elements.length > 0 ? (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
        <Box component="form" onSubmit={editElement} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.keys(elements[0]).slice(2).filter(key => !key.startsWith('type-')).map((key, index) => (
            <Box key={index} flexDirection="column" gap={1} sx={{ display: 'flex', width: '100%' }}>
              <TextField name={`value-${index}`} label={key} />
            </Box>
          ))}
          {alert && <Alert severity="error">{alertMessage}</Alert>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Edit Element
          </Button>
        </Box>
      </Paper>
    </Modal>
  ) : null;
}

export default EditElement;
