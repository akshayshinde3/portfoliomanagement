import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  return (
    <BrowserRouter basename="/portfoliomanagement">
      <Dashboard />
    </BrowserRouter>
  );
}

export default App;
