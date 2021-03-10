import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: process.env.NEXT_PUBLIC_THEME_PRIMARY_COLOR || '#2ca85e',
    },
    secondary: {
      main: '#121E34'
    },
    success: {
      main: '#2ca85e',
    },
    background: {
      default: '#EFF3F9',
    },
  }
});

export default theme;
