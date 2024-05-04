import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';

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
          element: <Home />,
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
