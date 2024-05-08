import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (newTheme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', setTheme: () => {} });

const lightTheme = createTheme();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme_] = useState(localStorage.getItem('theme') as 'light' | 'dark' || 'light');

  function setTheme(newTheme: 'light' | 'dark') {
    setTheme_(newTheme);
  }

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeProvider;
