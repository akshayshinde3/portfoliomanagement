import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material'
import {
  Person as BioIcon,
  School as EducationIcon,
  Work as ExperienceIcon,
  Code as ProjectIcon,
  Psychology as SkillIcon,
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

const drawerWidth = 280

const menuItems = [
  { text: 'Bio', icon: <BioIcon />, path: '/bio' },
  { text: 'Education', icon: <EducationIcon />, path: '/education' },
  { text: 'Experience', icon: <ExperienceIcon />, path: '/experience' },
  { text: 'Projects', icon: <ProjectIcon />, path: '/projects' },
  { text: 'Skills', icon: <SkillIcon />, path: '/skills' },
]

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const location = useLocation()
  const navigate = useNavigate()

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: 'white' }}>
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: 3,
        }}
      />
      <Divider />
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor: location.pathname === item.path ? '#F1F5F9' : 'transparent',
              color: location.pathname === item.path ? '#0F172A' : '#64748B',
              '&:hover': {
                backgroundColor: '#F8FAFC',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? '#0F172A' : '#64748B',
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
    </Box>
  )

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
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: 'white',
            border: 'none',
            boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: 'white',
            border: 'none',
            boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar 