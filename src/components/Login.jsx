import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { supabase } from "../config/supabase";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // On successful login, the App component will automatically redirect to /bio
      // due to the auth state change and routing configuration
    } catch (error) {
      console.error("Error logging in:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: 4,
            pb: 3,
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              mb: 2,
            }}
          >
            Sandesh Arsud Portfolio Management
          </Typography>
        </Box>

        <Divider />

        {/* Form Section */}
        <Box sx={{ p: 4 }}>
          <form onSubmit={handleLogin}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#F8FAFC",
                    "&:hover": {
                      backgroundColor: "#F1F5F9",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#F8FAFC",
                    },
                  },
                }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#64748B" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ color: "#64748B" }} />
                        ) : (
                          <VisibilityIcon sx={{ color: "#64748B" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#F8FAFC",
                    "&:hover": {
                      backgroundColor: "#F1F5F9",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#F8FAFC",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: 2,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                  },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Secure login for portfolio management
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
