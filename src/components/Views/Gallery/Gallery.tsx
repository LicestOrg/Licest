import { useAuth } from '@contexts';
import { AddElement, DeleteElement, EditElement } from '@components/ListForm';
import { ElementType, PropertyValueType } from '@types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, IconButton, ImageListItem, ImageListItemBar } from '@mui/material';
import { Masonry } from '@mui/lab';
import { Delete } from '@mui/icons-material';

function Gallery() {
  const { token } = useAuth();

  const { id } = useParams();

  const [elements, setElements] = useState<ElementType[]>([]);

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
      <Button onClick={() => setOpenAdd(true)}>Add Element</Button>

      <Masonry columns={3} spacing={1}>
        {elements.map((element, index) => (
          <div key={element.id} onClick={() => {
            setSelectedElement(index);
            setOpenEdit(true);
          }}>
            <ImageListItem key={element.id}>
              <img src={element.properties[0].value || ''} alt={element.name || ''} />
              <ImageListItemBar
                title={element.properties[1].value}
                subtitle={element.properties[2].value}
                actionIcon={
                  <IconButton onClick={(event) => {
                    event.stopPropagation();
                    setSelectedElement(index);
                    setOpenDelete(true);
                  }}>
                    <Delete />
                  </IconButton>
                }
              />
            </ImageListItem>
          </div>
        ))}
      </Masonry>

      <AddElement open={openAdd} setOpen={setOpenAdd} elements={elements} loadElements={loadElements} defaultProperties={[
        { type: PropertyValueType.STRING, name: 'Url', required: true },
        { type: PropertyValueType.STRING, name: 'Title', required: true },
        { type: PropertyValueType.STRING, name: 'Description' },
      ]} />
      <DeleteElement open={openDelete} setOpen={setOpenDelete} elements={elements} loadElements={loadElements} idElement={selectedElement} />
      <EditElement open={openEdit} setOpen={setOpenEdit} elements={elements} loadElements={loadElements} idElement={selectedElement} />
    </>
  );
}

export default Gallery;
