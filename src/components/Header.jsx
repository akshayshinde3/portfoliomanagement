import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const Header = ({ handleDrawerToggle, user }) => {
  const [bioData, setBioData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const { data: bioInfo, error: bioError } = await supabase
        .from("bio")
        .select("*")
        .single();

      if (bioError) throw bioError;
      setBioData(bioInfo);

      if (bioInfo?.image) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from("bio-images")
          .download(bioInfo.image);

        if (imageError) throw imageError;

        const imageUrl = URL.createObjectURL(imageData);
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const getUserDisplayName = () => {
    if (bioData?.name) {
      return bioData.name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return (
      profileImage ||
      bioData?.Image ||
      user?.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=0D8ABC&color=fff`
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none" },
            color: "#1E293B",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              color: "#1E293B",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            Akshay Shinde Portfolio Management
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {user && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={getUserAvatar()}
                    alt={getUserDisplayName()}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid white",
                      bgcolor: "#0D8ABC",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                  {!isMobile && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#1E293B",
                          fontWeight: 600,
                        }}
                      >
                        {getUserDisplayName()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748B",
                        }}
                      >
                        {bioData?.title || user.email}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: "#E2E8F0",
                    color: "#64748B",
                    "&:hover": {
                      borderColor: "#CBD5E1",
                      backgroundColor: "#F8FAFC",
                    },
                    textTransform: "none",
                  }}
                >
                  {isMobile ? "" : "Logout"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
