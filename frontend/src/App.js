import React from 'react';
import SalesLogsApp from './SalesLogsApp';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import Roboto font if you installed @fontsource/roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  // You can customize your theme here
  palette: {
    mode: 'light', // or 'dark'
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SalesLogsApp />
    </ThemeProvider>
  );
}

export default App;