import { useState } from 'react';
import { useAuth } from '@contexts';
import { Box, Button, Modal, Paper, TextField, Alert } from '@mui/material';

type DeleteElementProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  elements: unknown[];
  loadElements: () => void;
  selectedElement: unknown;
};

function DeleteElement({ open, setOpen, loadElements, elements, selectedElement }: DeleteElementProps) {

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

    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/elements/${selectedElement.uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
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
              <TextField name={`value-${index}`} label={key} value={selectedElement[key]} disabled />
            </Box>
          ))}
          <Button type="submit" variant="contained">Delete</Button>
          {alert && <Alert severity="error">{alertMessage}</Alert>}
        </Box>
      </Paper>
    </Modal>
  ) : null;
}

export default DeleteElement;
