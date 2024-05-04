import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  token: string | null;
  setToken: (newToken?: string) => void;
};

const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {} });

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken_] = useState(localStorage.getItem('token'));

  function setToken(newToken?: string) {
    setToken_(newToken || null);
  }

  useEffect(() => {
    if (token)
      localStorage.setItem('token', token);
    else
      localStorage.removeItem('token');
  }, [token]);

  const contextValue = useMemo(() => ({
    token,
    setToken,
  }), [token]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
