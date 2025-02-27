import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Person as BioIcon,
  School as EducationIcon,
  Work as ExperienceIcon,
  Code as ProjectIcon,
  Psychology as SkillIcon,
  Logout as LogoutIcon,
  Link as LinkIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const menuItems = [
  { text: "Bio", path: "/portfoliomanagement/", icon: <PersonIcon /> },
  { text: "Skills", path: "/portfoliomanagement/skills", icon: <BuildIcon /> },
  {
    text: "Experience",
    path: "/portfoliomanagement/experience",
    icon: <WorkIcon />,
  },
  {
    text: "Projects",
    path: "/portfoliomanagement/projects",
    icon: <CodeIcon />,
  },
  {
    text: "Education",
    path: "/portfoliomanagement/education",
    icon: <SchoolIcon />,
  },
  {
    text: "Short URLs",
    path: "/portfoliomanagement/short-urls",
    icon: <LinkIcon />,
  },
  {
    text: "Image Upload",
    path: "/portfoliomanagement/image-upload",
    icon: <ImageIcon />,
  },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", backgroundColor: "white" }}>
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (mobileOpen) handleDrawerToggle();
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor:
                location.pathname === item.path ? "#F1F5F9" : "transparent",
              color: location.pathname === item.path ? "#0F172A" : "#64748B",
              "&:hover": {
                backgroundColor: "#F8FAFC",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? "#0F172A" : "#64748B",
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ p: 2 }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#EF4444",
            "&:hover": {
              backgroundColor: "#FEE2E2",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#EF4444", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "white",
            border: "none",
            boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "white",
            border: "none",
            boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
