import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        light: '#6746c3', //light purple
        main: '#311b92', //dark purple
        dark: '#000063', //dark blue
        contrastText: '#fff', //white
      },
      secondary: {
        light: '#d3d3d3', //light grey
        main: '#BBDEFB', //sky blue
        dark: '#1976D2', //dark blue
        contrastText: '#000', //black
      },
      error: {
        main:  '#B00020',
      },
    },
  });