import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Redirect from "./components/Redirect";
import StorageForm from "./components/forms/StorageForm";

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
    <Router basename="/portfoliomanagement">
      <Routes>
        <Route path="/:shortCode" element={<Redirect />} />
        {/* ...other routes... */}
        <Route path="/storage" element={<StorageForm />} />
      </Routes>
    </Router>
  );
}

export default App;
