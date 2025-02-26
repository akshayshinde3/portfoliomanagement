import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import { CloudUpload, ContentCopy, Close } from "@mui/icons-material";
import { storage as configuredStorage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { supabase } from "../../config/supabase";
import LinkIcon from "@mui/icons-material/Link";

// Update the styles object
const styles = {
  gradientHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: 4,
  },
  headerText: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  uploadButton: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    fontWeight: 600,
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
    "&:hover": {
      background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(255,255,255,0.2)",
    },
    transition: "all 0.2s ease-in-out",
  },
  previewBox: {
    mt: 3,
    p: 3,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "grey.200",
    backgroundColor: "#F8FAFC",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
  },
  urlField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.2s ease",
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
          borderWidth: 2,
        },
      },
    },
  },
  nameField: {
    mt: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.2s ease",
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
          borderWidth: 2,
        },
      },
    },
  },
  previewContainer: {
    position: "relative",
    width: "100%",
    minHeight: 200,
    backgroundColor: "#F8FAFC",
    borderRadius: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    mb: 3,
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "400px",
    objectFit: "contain",
    borderRadius: 2,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    bgcolor: "rgba(15, 23, 42, 0.7)",
    color: "white",
    backdropFilter: "blur(4px)",
    "&:hover": {
      bgcolor: "rgba(15, 23, 42, 0.9)",
      transform: "scale(1.1)",
    },
    transition: "all 0.2s ease-in-out",
  },
  imageDimensions: {
    position: "absolute",
    bottom: 8,
    left: 8,
    bgcolor: "rgba(15, 23, 42, 0.7)",
    color: "white",
    padding: "4px 8px",
    borderRadius: 1,
    fontSize: "0.75rem",
    backdropFilter: "blur(4px)",
  },
};

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [shorteningLoading, setShorteningLoading] = useState(false);
  const [imageName, setImageName] = useState("");
  const [dimensions, setDimensions] = useState(null);

  const getImageDimensions = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = url;
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = async () => {
        setPreviewUrl(reader.result);
        const dims = await getImageDimensions(reader.result);
        setDimensions(dims);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      setLoading(true);
      const fileName = imageName.trim()
        ? `${imageName.replace(/[^a-zA-Z0-9-_]/g, "-")}-${uuidv4()}`
        : `${uuidv4()}-${selectedFile.name}`;

      const fileRef = ref(configuredStorage, `uploads/${fileName}`);

      const metadata = {
        contentType: selectedFile.type,
        customMetadata: {
          uploadedBy: "web-client",
          originalName: selectedFile.name,
          customName: imageName || "unnamed",
        },
      };

      await uploadBytes(fileRef, selectedFile, metadata);
      const url = await getDownloadURL(fileRef);
      setDownloadUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    toast.success("URL copied to clipboard!");
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDownloadUrl("");
    setImageName("");
    setDimensions(null);
  };

  const handleShortenUrl = async () => {
    if (!downloadUrl) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      setShorteningLoading(true);
      const shortCode = Math.random().toString(36).substr(2, 6);

      const { error } = await supabase.from("short_urls").insert([
        {
          long_url: downloadUrl,
          short_code: shortCode,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Generate consistent short URLs
      const shortUrl = `${window.location.origin}/portfoliomanagement/r/${shortCode}`;
      setShortUrl(shortUrl);
      toast.success("URL shortened successfully!");
    } catch (error) {
      console.error("Shortening error:", error);
      toast.error(`Failed to shorten URL: ${error.message}`);
    } finally {
      setShorteningLoading(false);
    }
  };

  // Update the return section
  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={styles.gradientHeader}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" sx={styles.headerText}>
                Image Upload
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Upload and share images easily
              </Typography>
            </Box>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
              sx={styles.uploadButton}
            >
              Select Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {previewUrl && (
            <Box sx={styles.previewBox}>
              <Box sx={styles.previewContainer}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                  sx={styles.previewImage}
                />
                <IconButton onClick={handleClear} sx={styles.closeButton}>
                  <Close />
                </IconButton>
                {dimensions && (
                  <Typography sx={styles.imageDimensions}>
                    {dimensions.width} × {dimensions.height}px
                  </Typography>
                )}
              </Box>

              <TextField
                fullWidth
                label="Image Name (optional)"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                sx={styles.nameField}
                placeholder="Enter a custom name for your image"
                InputProps={{
                  sx: { bgcolor: "white" },
                }}
              />

              {!downloadUrl && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleUpload}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    background:
                      "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease-in-out",
                    height: 48,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              )}
            </Box>
          )}

          {downloadUrl && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "#1E293B", fontWeight: 600 }}
              >
                Image URL
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  value={downloadUrl}
                  InputProps={{ readOnly: true }}
                  sx={styles.urlField}
                />
                <IconButton
                  onClick={handleCopyUrl}
                  sx={{
                    color: "#1E293B",
                    "&:hover": {
                      backgroundColor: "#F1F5F9",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ContentCopy />
                </IconButton>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={handleShortenUrl}
                  disabled={shorteningLoading}
                  sx={{
                    borderColor: "#E2E8F0",
                    color: "#1E293B",
                    "&:hover": {
                      borderColor: "#94A3B8",
                      bgcolor: "#F8FAFC",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {shorteningLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Shorten URL"
                  )}
                </Button>
              </Box>

              {shortUrl && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, color: "#1E293B", fontWeight: 600 }}
                  >
                    Shortened URL
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      value={shortUrl}
                      InputProps={{ readOnly: true }}
                      sx={styles.urlField}
                    />
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(shortUrl);
                        toast.success("Short URL copied to clipboard!");
                      }}
                      sx={{
                        color: "#1E293B",
                        "&:hover": {
                          backgroundColor: "#F1F5F9",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ImageUploadForm;
