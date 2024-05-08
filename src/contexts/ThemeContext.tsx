import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeType } from '@types';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (newTheme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType>({ theme: ThemeType.LIGHT, setTheme: () => {} });

const lightTheme = createTheme();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme_] = useState(localStorage.getItem('theme') as unknown as ThemeType || ThemeType.LIGHT);

  function setTheme(newTheme: ThemeType) {
    setTheme_(newTheme);
  }

  useEffect(() => {
    localStorage.setItem('theme', theme.toString());
  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme === ThemeType.LIGHT ? lightTheme : darkTheme}>
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
