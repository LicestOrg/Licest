import { AuthContext, UserContext, ThemeContext } from '@contexts';
import Router from './router/Router';

function App() {
  return (
    <AuthContext>
      <UserContext>
        <ThemeContext>
          <Router />
        </ThemeContext>
      </UserContext>
    </AuthContext>
  );
}

export default App;
