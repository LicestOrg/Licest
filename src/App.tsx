import AuthProvider from './context/AuthContext';
import Router from './router/Router';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
