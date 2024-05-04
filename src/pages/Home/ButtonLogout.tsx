import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@mui/material';

function ButtonLogout() {
  const { setToken } = useAuth();

  function handleLogout() {
    setToken();
  }

  return (
    <Button
      href="/"
      variant="contained"
      color="primary"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}

export default ButtonLogout;
