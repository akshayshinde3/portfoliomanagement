import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  CloudUpload,
  ContentCopy,
  Close,
  Delete,
  Home as HomeIcon,
  Folder as FolderIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { storage as configuredStorage } from "../../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "../../config/supabase";
import LinkIcon from "@mui/icons-material/Link";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

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
  tableContainer: {
    mt: 4,
    borderRadius: 2,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    overflow: "auto",
    maxWidth: "100vw",
    "& .MuiTable-root": {
      minWidth: 1400,
    },
  },
  tableHeader: {
    backgroundColor: "#F8FAFC",
  },
  tableHeaderCell: {
    color: "#1E293B",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  imagePreviewCell: {
    width: 100,
    p: 1,
    minWidth: 100, // Added minimum width
  },
  imageThumb: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 1,
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  urlCell: {
    maxWidth: 200, // Reduced from 300
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  folderCell: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  typeCell: {
    maxWidth: 120,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  sizeCell: {
    width: 100,
    minWidth: 100,
  },
  dateCell: {
    width: 120,
    minWidth: 120,
  },
  actionsCell: {
    width: 120,
    minWidth: 120,
  },
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  dimensionHelper: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mt: 2,
    color: "#64748B",
    fontSize: "0.875rem",
    padding: "8px 12px",
    backgroundColor: "#F1F5F9",
    borderRadius: 1,
    border: "1px solid #E2E8F0",
  },
};

// Add these styles to your dialogStyles object
const dialogStyles = {
  // ...existing styles...
  uploadArea: {
    position: "relative",
    width: "100%",
    minHeight: 300,
    backgroundColor: "#F8FAFC",
    borderRadius: 2,
    border: "2px dashed #CBD5E1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#94A3B8",
      backgroundColor: "#F1F5F9",
      transform: "translateY(-2px)",
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
    maxHeight: "300px",
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

// Add this helper function
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("root");
  const [folders, setFolders] = useState(["root"]); // Remove hardcoded folders
  const [foldersLoading, setFoldersLoading] = useState(true);

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
        toast.success("Image selected successfully!");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  // Update the handleUpload function to use the selected folder
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    const loadingToast = toast.loading("Uploading image...");
    try {
      setLoading(true);
      const fileExtension = selectedFile.name.split(".").pop();
      const fileName = imageName.trim()
        ? `${imageName.replace(/[^a-zA-Z0-9-_\s]/g, "-")}.${fileExtension}`
        : selectedFile.name;

      const uniqueFileName = `${
        fileName.split(".")[0]
      }-${uuidv4()}.${fileExtension}`;

      // Use selected folder in the path
      const folderPath = selectedFolder === "root" ? "" : `${selectedFolder}/`;
      const fileRef = ref(
        configuredStorage,
        `uploads/${folderPath}${uniqueFileName}`
      );

      const metadata = {
        contentType: selectedFile.type,
        customMetadata: {
          uploadedBy: "web-client",
          originalName: selectedFile.name,
          customName: imageName || "unnamed",
          folder: selectedFolder,
        },
      };

      await uploadBytes(fileRef, selectedFile, metadata);
      const url = await getDownloadURL(fileRef);
      setDownloadUrl(url);

      setUploadedImages((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: fileName,
          url: url,
          path: `uploads/${folderPath}${uniqueFileName}`,
          size: selectedFile.size,
          dimensions: dimensions,
          folder: selectedFolder,
        },
      ]);

      toast.dismiss(loadingToast);
      toast.success("Image uploaded successfully!");
      handleClear();
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss(loadingToast);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!", {
      icon: "📋",
    });
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDownloadUrl("");
    setImageName("");
    setDimensions(null);
    toast.success("Form cleared", {
      duration: 2000,
    });
  };

  const handleDelete = async (imagePath) => {
    const loadingToast = toast.loading("Deleting image...");
    try {
      const fileRef = ref(configuredStorage, imagePath);
      await deleteObject(fileRef);
      toast.dismiss(loadingToast);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to delete image: ${error.message}`);
    }
  };

  const handleOpenFileDialog = () => {
    setOpenFileDialog(true);
  };

  const handleCloseFileDialog = () => {
    setOpenFileDialog(false);
  };

  const handleUploadFile = (event) => {
    event.preventDefault();
    handleUpload();
    handleCloseFileDialog();
  };

  // const handleShortenUrl = async () => {
  //   if (!downloadUrl) {
  //     toast.error("Please upload an image first");
  //     return;
  //   }

  //   try {
  //     setShorteningLoading(true);
  //     const shortCode = Math.random().toString(36).substr(2, 6);

  //     const { error } = await supabase.from("short_urls").insert([
  //       {
  //         long_url: downloadUrl,
  //         short_code: shortCode,
  //         created_at: new Date().toISOString(),
  //       },
  //     ]);

  //     if (error) throw error;

  //     // Generate consistent short URLs
  //     const shortUrl = `${window.location.origin}/portfoliomanagement/r/${shortCode}`;
  //     setShortUrl(shortUrl);
  //     toast.success("URL shortened successfully!");
  //   } catch (error) {
  //     console.error("Shortening error:", error);
  //     toast.error(`Failed to shorten URL: ${error.message}`);
  //   } finally {
  //     setShorteningLoading(false);
  //   }
  // };

  // Add this function after the existing state declarations
  const fetchBucketFolders = async () => {
    const loadingToast = toast.loading("Fetching folders...");
    try {
      const storageRef = ref(configuredStorage);
      const result = await listAll(storageRef);

      // Get all items to check for folders
      const fetchPromises = result.items.map(async (item) => {
        const metadata = await getMetadata(item);
        const fullPath = metadata.fullPath;
        return fullPath.split("/")[0]; // Get the first level folder
      });

      // Get folders from prefixes
      const prefixFolders = result.prefixes.map((prefix) => prefix.name);

      // Combine and get unique folders
      const itemFolders = await Promise.all(fetchPromises);
      const allFolders = [...new Set([...prefixFolders, ...itemFolders])];

      // Filter out empty strings and system folders
      const validFolders = allFolders
        .filter(
          (folder) =>
            folder && folder !== "undefined" && !folder.startsWith(".")
        )
        .sort();

      // Always include root and ensure unique values
      const finalFolders = ["root", ...validFolders];
      setFolders(finalFolders);

      toast.dismiss(loadingToast);
      toast.success(`Found ${validFolders.length} folders`);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to load folders: ${error.message}`);
    }
  };

  // Add useEffect to fetch folders when component mounts
  useEffect(() => {
    let mounted = true;

    const fetchFolders = async () => {
      if (mounted) {
        await fetchBucketFolders();
      }
    };

    fetchFolders();

    return () => {
      mounted = false;
    };
  }, []);

  // Update the return section
  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#10B981",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#EF4444",
            },
          },
          loading: {
            style: {
              background: "#1E293B",
              color: "white",
            },
          },
        }}
      />
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
              onClick={handleOpenFileDialog}
            >
              Select Image
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
                label="Image Name"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                sx={styles.nameField}
                placeholder="Enter the full image name (e.g., my-image)"
                helperText="File extension will be added automatically"
                InputProps={{
                  sx: { bgcolor: "white" },
                }}
              />

              <Box sx={styles.dimensionHelper}>
                <InfoIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  Recommended dimensions for project thumbnails: 5312 × 3072px
                  (1.73:1 ratio)
                </Typography>
              </Box>

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
                  onClick={() => handleCopyUrl(downloadUrl)}
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

      {uploadedImages.length > 0 && (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow sx={styles.tableHeader}>
                <TableCell sx={styles.tableHeaderCell}>Preview</TableCell>
                <TableCell sx={styles.tableHeaderCell}>File Name</TableCell>
                <TableCell sx={styles.tableHeaderCell}>URL</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Size</TableCell>
                <TableCell sx={styles.tableHeaderCell} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploadedImages.map((image) => (
                <TableRow key={image.id}>
                  <TableCell sx={styles.imagePreviewCell}>
                    <Box
                      component="img"
                      src={image.url}
                      alt={image.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 1,
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{image.name}</TableCell>
                  <TableCell sx={styles.urlCell}>
                    <Tooltip title={image.url}>
                      <span>{image.url}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatFileSize(image.size)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Copy URL">
                      <IconButton
                        onClick={() => handleCopyUrl(image.url)}
                        sx={styles.actionButton}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(image.path)}
                        sx={{
                          ...styles.actionButton,
                          color: "#EF4444",
                          "&:hover": {
                            color: "#DC2626",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openFileDialog}
        onClose={handleCloseFileDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Select Image
            </Typography>
            <IconButton onClick={handleCloseFileDialog} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, px: 3, pb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              component="label"
              htmlFor="image-input"
              sx={dialogStyles.uploadArea}
            >
              <CloudUpload sx={{ fontSize: 48, color: "#64748B", mb: 2 }} />
              <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                Click here to select an image
              </Typography>
              <Typography variant="caption" sx={{ mt: 2, color: "#94A3B8" }}>
                Supported formats: PNG, JPG, GIF up to 10MB
              </Typography>
              <input
                id="image-input"
                type="file"
                hidden
                onChange={(e) => {
                  handleFileSelect(e);
                  handleCloseFileDialog();
                }}
                accept="image/*"
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Destination Folder</InputLabel>
              <Select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                label="Destination Folder"
                disabled={foldersLoading}
              >
                <MenuItem value="root">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HomeIcon sx={{ color: "#64748B" }} />
                    Root Folder
                  </Box>
                </MenuItem>
                {folders
                  .filter((f) => f !== "root")
                  .map((folder) => (
                    <MenuItem key={folder} value={folder}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <FolderIcon sx={{ color: "#64748B" }} />
                        <Typography>{folder}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Add a refresh button next to the folder select */}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={fetchBucketFolders}
                sx={{
                  color: "#64748B",
                  "&:hover": {
                    backgroundColor: "#F1F5F9",
                  },
                }}
              >
                Refresh Folders
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={handleCloseFileDialog}
            variant="outlined"
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            component="label"
            htmlFor="image-input"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Select Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUploadForm;
