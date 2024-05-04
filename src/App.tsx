import AuthProvider from './contexts/AuthContext';
import UserProvider from './contexts/UserContext';
import Router from './router/Router';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
