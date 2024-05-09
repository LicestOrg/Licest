import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@contexts';
import { Table, Gallery, Todo } from '@components/Views';
import { PageViewType } from '@types';
import NotFound from '../NotFound/NotFound';

function Page() {
  const { token } = useAuth();

  const { id } = useParams();

  const [type, setType] = useState<string | null>(null);

  function getType() {
    fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/pages/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setType(data.type);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getType();
  }, []);

  switch (type) {
  case PageViewType.TABLE:
    return <Table />;
  case PageViewType.GALLERY:
    return <Gallery />;
  case PageViewType.TODO:
    return <Todo />;
  default:
    return <NotFound />;
  }
}

export default Page;
