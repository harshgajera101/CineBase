import { createContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#667eea',
          },
          secondary: {
            main: '#764ba2',
          },
          background: {
            default: '#0a0a0a',
            paper: '#1a1a1a',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
          },
        },
        typography:  {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize:  '2.5rem',
            fontWeight: 700,
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 600,
          },
        },
      }),
    []
  );

  return (
    <ThemeContext.Provider value={{ mode:  'dark' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};