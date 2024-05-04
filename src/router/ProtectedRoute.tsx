import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute() {
  const { token } = useAuth();
  return token
    ? <Outlet />
    : <Navigate to="/login" />;
}

export default ProtectedRoute;
