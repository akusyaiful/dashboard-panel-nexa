"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3572EF",
    },
    secondary: {
      main: "#FF0060",
    },
    success: {
      main: "#4F9DA6",
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h3: {
      fontSize: 32,
      fontWeight: 600,
      "@media (max-width:425px)": {
        fontSize: 18,
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: "100%",
          borderRadius: "8px",
          padding: "8px",
          fontSize: "16px",
          height: "47px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
        input: {
          padding: "12px",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          alignItems: "center",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "8px",
          border: "1px solid #cbcbcb",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          color: "black",
          boxShadow: "rgba(0, 0, 0, 0.04) 0px 3px 5px;",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          width: "90%",
          borderRadius: "8px",
          marginLeft: "12px",
          "&.Mui-selected": {
            backgroundColor: "#3572EF",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: "400px",
          width: "100%",
          borderRadius: "8px",
          marginLeft: "12px",
          "&.Mui-selected": {
            backgroundColor: "#3572EF",
          },
        },
      },
    },
  },
});

export default theme;
