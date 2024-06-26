import { useAuth, useUser } from '@contexts';
import { UserType } from '@types';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function Home() {
  const { token } = useAuth();
  const { user } = useUser();

  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.map((user: UserType) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        })));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [user]);

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountCircle /> Users
      </Typography>
      <DataGrid
        rows={users}
        columns={[
          { field: 'name', headerName: 'Name', width: 150 },
          { field: 'tag', headerName: 'Tag', width: 150 },
          { field: 'email', headerName: 'Email', width: 200 },
          { field: 'updatedAt', headerName: 'Last Login', width: 200 },
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
      />
    </>
  );
}

export default Home;
