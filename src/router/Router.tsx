import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from '@contexts';
import ProtectedRoute from './ProtectedRoute';
import Home from '@pages/Home/Home';
import Login from '@pages/Login/Login';
import Register from '@pages/Register/Register';
import NotFound from '@pages/NotFound/NotFound';
import Page from '@pages/Page/Page';
import Layout from '@components/Layout/Layout';

function Routes() {
  const { token } = useAuth();
  const routesForPublic = [
    {
      path: '*',
      element: <NotFound />,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <Layout><Home /></Layout>,
        },
        {
          path: '/page/:id',
          element: <Layout><Page /></Layout>,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
}

export default Routes;
