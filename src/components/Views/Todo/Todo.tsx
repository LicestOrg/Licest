import { useAuth } from '@contexts';
import { AddElement, DeleteElement, EditElement } from '@components/ListForm';
import { ElementType } from '@types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function Todo() {
  const { token } = useAuth();

  const { id } = useParams();

  const [elements, setElements] = useState<ElementType[]>([]);
  const [states, setStates] = useState<string[]>([]);

  const [selectedElement, setSelectedElement] = useState<number>(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

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
        setElements(data);
        setStates([...new Set(data.map((element: ElementType) => element.properties[0].value))] as string[]);
        console.log(
          [...new Set(data.map((element: ElementType) => element.properties[0].value))] as string[]
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    loadElements();
  }, []);

  return (
    <>
      <p className="italic font-light text-sm text-gray-500">
        *Set a tag state and a tag name to set the title
      </p>
      <Button onClick={() => setOpenAdd(true)}>Add Element</Button>

      <Grid container spacing={2} columns={states.length} overflow="scroll" wrap="nowrap" margin="10px">
        {states.map((state, index) => (
          <Grid item key={index} sx={{ minWidth: '400px' }}>
            <h2 className="text-xl font-bold">{state}</h2>
            <List>
              {elements.filter((element: ElementType) => element.properties[0].value === state).map((element, index) => (
                <ListItem key={element.id}>
                  <ListItemButton onClick={() => {
                    setSelectedElement(index);
                    setOpenEdit(true);
                  }}>
                    <ListItemText primary={element.name} secondary={element.properties[1].value} />
                  </ListItemButton>
                  <div className="flex height-full">
                    <ListItemButton onClick={() => {
                      setSelectedElement(index);
                      setOpenEdit(true);
                    }}>
                      <Edit />
                    </ListItemButton>
                    <ListItemButton onClick={() => {
                      setSelectedElement(index);
                      setOpenDelete(true);
                    }}>
                      <Delete />
                    </ListItemButton>
                  </div>
                </ListItem>
              ))}
            </List>
          </Grid>
        ))}
      </Grid>

      <AddElement open={openAdd} setOpen={setOpenAdd} elements={elements} loadElements={loadElements} />
      <DeleteElement open={openDelete} setOpen={setOpenDelete} elements={elements} loadElements={loadElements} idElement={selectedElement} />
      <EditElement open={openEdit} setOpen={setOpenEdit} elements={elements} loadElements={loadElements} idElement={selectedElement} />
    </>
  );
}

export default Todo;
