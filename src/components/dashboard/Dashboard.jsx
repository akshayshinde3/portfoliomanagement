import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/portfoliomanagement/").pop();
    switch (path) {
      case "skills":
        return "Skills";
      case "experience":
        return "Experience";
      case "projects":
        return "Projects";
      case "education":
        return "Education";
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
          <Route path="/portfoliomanagement/" element={<BioForm />} />
          <Route path="/portfoliomanagement/skills" element={<SkillForm />} />
          <Route
            path="/portfoliomanagement/experience"
            element={<ExperienceForm />}
          />
          <Route
            path="/portfoliomanagement/projects"
            element={<ProjectForm />}
          />
          <Route
            path="/portfoliomanagement/education"
            element={<EducationForm />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
