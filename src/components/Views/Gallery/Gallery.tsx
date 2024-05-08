import { useAuth } from '@contexts';
import { AddElement, DeleteElement, EditElement } from '@components/ListForm';
import { ElementType } from '@types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, IconButton, ImageListItem, ImageListItemBar } from '@mui/material';
import { Masonry } from '@mui/lab';
import { Delete } from '@mui/icons-material';

function Gallery() {
  const { token } = useAuth();

  const { id } = useParams();

  const [elements, setElements] = useState<ElementType[]>([]);
  const [selectedElement, setSelectedElement] = useState<object>({});
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
        setElements(data.map((element: ElementType, index: number) => {
          const properties: object = { uid: element.id };
          element.properties.forEach((property) => {
            properties[`type-${index}`] = property.type;
            properties[property.name] = property.value;
          });
          return properties;

        }));
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
        *Set a tag url to set the image and a tag name to set the title
      </p>
      <Button onClick={() => setOpenAdd(true)}>Add Element</Button>

      <Masonry columns={3} spacing={1}>
        {elements.map((element) => (
          <div key={element.uid} onClick={() => {
            setSelectedElement(element);
            setOpenEdit(true);
          }}>
            <ImageListItem key={element.uid}>
              <img src={element.url || ''} alt={element.name || ''} />
              <ImageListItemBar
                title={element.name}
                subtitle={element.description}
                actionIcon={
                  <IconButton onClick={(event) => {
                    event.stopPropagation();
                    setSelectedElement(element);
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

      <AddElement open={openAdd} setOpen={setOpenAdd} elements={elements} loadElements={loadElements} />
      <DeleteElement open={openDelete} setOpen={setOpenDelete} elements={elements} loadElements={loadElements} selectedElement={selectedElement} />
      <EditElement open={openEdit} setOpen={setOpenEdit} elements={elements} loadElements={loadElements} selectedElement={selectedElement} />
    </>
  );
}

export default Gallery;
