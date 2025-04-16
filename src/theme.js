import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#527da3',
      light: '#7a9bc1',
      dark: '#365980',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#527da3',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#527da3',
        },
      },
    },
  },
})

export default theme