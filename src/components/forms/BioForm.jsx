import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Save as SaveIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Description as ResumeIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { supabase } from "../../config/supabase";
import { bioApi, copyrightApi } from "../../api/SupabaseData";

const BioForm = () => {
  const [bio, setBio] = useState({
    name: "",
    roles: [], // Should be configured as a text array in Supabase
    description: "",
    github: "",
    resume: "",
    linkedin: "",
    twitter: "",
    insta: "",
    image: "",
  });
  const [copyright, setCopyright] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const commonButtonSx = {
    backgroundColor: "#0F172A",
    "&:hover": { backgroundColor: "#1E293B" },
    borderRadius: 2,
    textTransform: "none",
    px: 4,
    minWidth: { xs: "100%", sm: "160px" }, // Set minimum width for consistency
    height: 42, // Set fixed height
    fontSize: "0.875rem", // Set consistent font size
  };

  const paperStyles = {
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    },
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "white",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#F8FAFC",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#94A3B8",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "#F8FAFC",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#0F172A",
        },
      },
    },
  };

  const socialIconStyles = (color) => ({
    color: color,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: `${color}15`,
      transform: "translateY(-2px)",
    },
  });

  useEffect(() => {
    fetchBio();
    fetchCopyright();
  }, []);

  const fetchBio = async () => {
    try {
      const data = await bioApi.fetch();
      setBio({
        ...data,
        roles: Array.isArray(data?.roles) ? data.roles : [],
      });
      setRoleInput(Array.isArray(data?.roles) ? data.roles.join(", ") : "");
    } catch (error) {
      toast.error("Error fetching bio: " + error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!bio.name || !bio.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      await bioApi.update(bio);
      await fetchBio();
      toast.success("Bio updated successfully");
    } catch (error) {
      toast.error("Error saving bio: " + error.message);
    }
  };

  const fetchCopyright = async () => {
    try {
      const { data, error } = await supabase
        .from("copyright")
        .select("*")
        .single();

      if (error) throw error;
      console.log("Fetched copyright:", data);
      setCopyright(data?.copyright || "");
    } catch (error) {
      console.error("Error fetching copyright:", error);
      toast.error("Error fetching copyright: " + error.message);
    }
  };

  const handleCopyrightSubmit = async () => {
    try {
      const { error } = await supabase.from("copyright").upsert({
        id: 1, // Assuming you have only one copyright record
        copyright: copyright.trim(),
      });

      if (error) throw error;

      await fetchCopyright();
      toast.success("Copyright updated successfully");
    } catch (error) {
      console.error("Error saving copyright:", error);
      toast.error("Error saving copyright: " + error.message);
    }
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setRoleInput(value); // Update the temporary input state

    // Update the actual roles array only when needed
    const rolesArray = value
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    setBio((prev) => ({
      ...prev,
      roles: rolesArray,
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Paper sx={paperStyles}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            p: 4,
            color: "white",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bio Information
          </Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8" }}>
            Manage your personal information and social links
          </Typography>
        </Box>

        <Box sx={{ p: 4, backgroundColor: "#FFFFFF" }}>
          <Grid container spacing={4}>
            {/* Profile Image Section */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box
                sx={{
                  position: "relative",
                  "&:hover": {
                    "& .image-overlay": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Avatar
                  src={bio.image}
                  alt={bio.name}
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Profile Image URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Image URL"
                value={bio.image || ""}
                onChange={(e) => setBio({ ...bio, image: e.target.value })}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name"
                value={bio.name || ""}
                onChange={(e) => setBio({ ...bio, name: e.target.value })}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Roles */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Roles (comma-separated)"
                value={roleInput} // Use roleInput instead of converting roles array
                onChange={handleRoleChange}
                helperText="Enter roles separated by commas (e.g., Developer, Designer, Writer)"
                sx={textFieldStyles}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                value={bio.description || ""}
                onChange={(e) =>
                  setBio({ ...bio, description: e.target.value })
                }
                sx={textFieldStyles}
              />
            </Grid>

            {/* Social Links */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={bio.github || ""}
                onChange={(e) => setBio({ ...bio, github: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <GitHubIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={bio.linkedin || ""}
                onChange={(e) => setBio({ ...bio, linkedin: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <LinkedInIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Twitter URL"
                value={bio.twitter || ""}
                onChange={(e) => setBio({ ...bio, twitter: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <TwitterIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram URL"
                value={bio.insta || ""}
                onChange={(e) => setBio({ ...bio, insta: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InstagramIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume URL"
                value={bio.resume || ""}
                onChange={(e) => setBio({ ...bio, resume: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <ResumeIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  sx={{
                    ...commonButtonSx,
                    background:
                      "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Social Links Preview */}
      <Paper sx={{ ...paperStyles, mt: 3, p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#0F172A",
            mb: 2,
            fontWeight: 600,
          }}
        >
          Social Links Preview
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {bio.github && (
            <IconButton
              href={bio.github}
              target="_blank"
              sx={socialIconStyles("#24292e")}
            >
              <GitHubIcon />
            </IconButton>
          )}
          {bio.linkedin && (
            <IconButton
              href={bio.linkedin}
              target="_blank"
              sx={socialIconStyles("#0077B5")}
            >
              <LinkedInIcon />
            </IconButton>
          )}
          {bio.twitter && (
            <IconButton
              href={bio.twitter}
              target="_blank"
              sx={socialIconStyles("#1DA1F2")}
            >
              <TwitterIcon />
            </IconButton>
          )}
          {bio.insta && (
            <IconButton
              href={bio.insta}
              target="_blank"
              sx={socialIconStyles("#E4405F")}
            >
              <InstagramIcon />
            </IconButton>
          )}
          {bio.resume && (
            <IconButton
              href={bio.resume}
              target="_blank"
              sx={socialIconStyles("#1E293B")}
            >
              <ResumeIcon />
            </IconButton>
          )}
        </Box>
      </Paper>

      {/* Copyright Section */}
      <Paper sx={{ ...paperStyles, mt: 3, p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#0F172A",
              fontWeight: 600,
              mb: { xs: 2, sm: 0 },
            }}
          >
            Copyright Information
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Copyright Text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            helperText="Example: © 2024 Your Name. All rights reserved."
            sx={textFieldStyles}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Preview: {copyright || "No copyright text set"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleCopyrightSubmit}
              sx={commonButtonSx}
            >
              Save Copyright
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BioForm;
