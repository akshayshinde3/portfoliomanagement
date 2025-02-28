import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import BioForm from "../forms/BioForm";
import SkillForm from "../forms/SkillForm";
import ExperienceForm from "../forms/ExperienceForm";
import ProjectForm from "../forms/ProjectForm";
import EducationForm from "../forms/EducationForm";
import ContactForm from "../forms/ContactForm";
import ImageUploadForm from "../forms/ImageUploadForm";
import StorageForm from "../forms/StorageForm";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/portfoliomanagement/").pop();
    switch (path) {
      case "":
        return "Bio";
      case "skills":
        return "Skills";
      case "experience":
        return "Experience";
      case "projects":
        return "Projects";
      case "education":
        return "Education";
      case "contacts":
        return "Contacts";
      case "short-urls":
        return "Short URLs";
      case "image-upload":
        return "Image Upload";
      case "storage":
        return "Storage";
      default:
        return "Bio";
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${240}px)` },
          ml: { sm: `${240}px` },
          bgcolor: "white",
          color: "#1E293B",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600 }}
          >
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: 7, sm: 8 },
          width: { xs: "100%", sm: `calc(100% - ${240}px)` },
        }}
      >
        <Routes>
          <Route path="/" element={<BioForm />} />
          <Route path="/skills" element={<SkillForm />} />
          <Route path="/experience" element={<ExperienceForm />} />
          <Route path="/projects" element={<ProjectForm />} />
          <Route path="/education" element={<EducationForm />} />
          <Route path="/contacts" element={<ContactForm />} />
          <Route path="/image-upload" element={<ImageUploadForm />} />
          <Route path="/storage" element={<StorageForm />} />
          <Route
            path="*"
            element={<Navigate to="/portfoliomanagement" replace />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
