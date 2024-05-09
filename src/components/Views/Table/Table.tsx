import { useAuth } from '@contexts';
import { AddElement, DeleteElement, EditElement } from '@components/ListForm';
import { ElementType } from '@types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import { Button } from '@mui/material';

function Table() {
  const { token } = useAuth();

  const { id } = useParams();

  const [elements, setElements] = useState<ElementType[]>([]);

  const [elementsProperties, setElementsProperties] = useState<object[]>([]);
  const [keys, setKeys] = useState<GridColDef[]>([]);

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
        setElementsProperties(data.map((element: ElementType, index: number) => {
          const properties: { [key: string]: string } = { id: (index + 1).toString() };
          element.properties.forEach((property) => {
            properties[property.name] = property.value;
          });
          return properties;
        }));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function getKeys() {
    return elementsProperties.length > 0 ? [
      ...Object.keys(elementsProperties[0]).map((key) => ({
        field: key,
        headerName: key,
      })),
      {
        field: 'edit',
        headerName: '',
        width: 1,
        sortable: false,
        renderCell: (params: { row: { id: number } }) => (
          <Edit onClick={() => {
            setSelectedElement(params.row.id - 1);
            setOpenEdit(true);
          }} />
        ),
      },
      {
        field: 'delete',
        headerName: '',
        width: 1,
        sortable: false,
        renderCell: (params: { row: { id: number } }) => (
          <Delete onClick={() => {
            setSelectedElement(params.row.id - 1);
            setOpenDelete(true);
          }} />
        ),
      },
    ] : [];
  }

  useEffect(() => {
    loadElements();
  }, []);

  useEffect(() => {
    setKeys(getKeys());
  }, [elementsProperties]);

  return (
    <>
      <Button onClick={() => setOpenAdd(true)}>Add Element</Button>
      {elementsProperties.length > 0 && keys.length > 0 && (
        <DataGrid
          rows={elementsProperties}
          columns={keys}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
        />
      )}
      <AddElement open={openAdd} setOpen={setOpenAdd} elements={elements} loadElements={loadElements} />
      <DeleteElement open={openDelete} setOpen={setOpenDelete} elements={elements} loadElements={loadElements} idElement={selectedElement} />
      <EditElement open={openEdit} setOpen={setOpenEdit} elements={elements} loadElements={loadElements} idElement={selectedElement} />
    </>
  );
}

export default Table;
