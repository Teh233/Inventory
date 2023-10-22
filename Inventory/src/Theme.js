import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(9, 41, 92)",
      light: "rgb(66, 135, 245)",
    },
    secondary: {
      main: "rgb(3, 99, 34)",
      light: "rgb(5, 158, 54)",
    },
    mode: localStorage.getItem("mode") === true ? "dark" : "light", // Retrieve mode value from localStorage or set it to "light" as default
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1900,
    },
  },
});
 