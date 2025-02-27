import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { Box, CircularProgress, Typography } from "@mui/material";

const Redirect = () => {
  const { shortCode } = useParams();
  const [longUrl, setLongUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const { data, error } = await supabase
          .from("short_urls")
          .select("long_url")
          .eq("short_code", shortCode)
          .single();

        if (error) throw error;
        if (data) {
          setLongUrl(data.long_url);
        } else {
          setError("URL not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [shortCode]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Redirecting...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (longUrl) {
    window.location.href = longUrl;
    return null;
  }

  return <Navigate to="/portfoliomanagement" replace />;
};

export default Redirect;
