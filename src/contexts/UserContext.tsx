import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserType = {
  id: string;
  tag: string;
  email: string;
  name: string;
};

type UserContextType = {
  user: UserType | null;
  setUser: (newUser?: UserType) => void;
};

const UserContext = createContext<UserContextType>({ user: null, setUser: () => {} });

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser_] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null);

  function setUser(newUser?: UserType) {
    setUser_(newUser || null);
  }

  useEffect(() => {
    if (user)
      localStorage.setItem('user', JSON.stringify(user));
    else
      localStorage.removeItem('user');
  }, [user]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
  }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export default UserProvider;
