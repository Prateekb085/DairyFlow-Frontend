import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
    },

    secondary: {
      main: "#10B981",
    },

    background: {
      default: "#F4F7FE",
      paper: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",

    h4: {
      fontFamily: "Poppins",
      fontWeight: 700,
    },

    h5: {
      fontFamily: "Poppins",
      fontWeight: 700,
    },

    h6: {
      fontFamily: "Poppins",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 16,
  },
});

export default theme;