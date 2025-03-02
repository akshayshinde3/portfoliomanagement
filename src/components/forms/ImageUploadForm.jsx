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
  Home as HomeIcon,
  Folder as FolderIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Sync as LoadingIcon,
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

// Update the styles object with modern design elements
const styles = {
  // Enhanced gradient header with more depth
  gradientHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: 4,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "1px",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    },
  },

  // Modern paper styles with subtle shadows and hover effects
  paper: {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(241, 245, 249, 0.2)",
    backdropFilter: "blur(20px)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
  },

  // Enhanced upload button with modern gradient
  uploadButton: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
    "&:hover": {
      background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(255,255,255,0.2)",
    },
  },

  // Modern table design
  tableContainer: {
    mt: 4,
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    overflow: "hidden",
    border: "1px solid rgba(241, 245, 249, 0.2)",
    backdropFilter: "blur(20px)",
    "& .MuiTable-root": {
      minWidth: 1400,
    },
    "& .MuiTableRow-root": {
      transition: "background-color 0.2s ease",
      "&:hover": {
        backgroundColor: "#F8FAFC",
      },
    },
  },

  // Modern dialog design
  dialogPaper: {
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
  },

  // Enhanced upload area
  uploadArea: {
    position: "relative",
    width: "100%",
    minHeight: 300,
    backgroundColor: "#F8FAFC",
    borderRadius: "16px",
    border: "2px dashed #CBD5E1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#94A3B8",
      backgroundColor: "#F1F5F9",
      transform: "translateY(-2px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.05)",
    },
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

// Add modern toast configuration
const toastConfig = {
  position: "top-center",
  style: {
    background: "rgba(15, 23, 42, 0.95)",
    color: "white",
    backdropFilter: "blur(8px)",
    borderRadius: "16px",
    padding: "16px 24px",
    maxWidth: "500px",
    width: "90%",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  success: {
    icon: (
      <SuccessIcon
        sx={{
          animation: "rotate 0.5s ease-out",
          "@keyframes rotate": {
            "0%": { transform: "scale(0.5) rotate(-180deg)" },
            "100%": { transform: "scale(1) rotate(0)" },
          },
        }}
      />
    ),
    duration: 2000,
  },
  error: {
    icon: (
      <ErrorIcon
        sx={{
          animation: "shake 0.5s ease-in-out",
          "@keyframes shake": {
            "0%, 100%": { transform: "translateX(0)" },
            "25%": { transform: "translateX(-4px)" },
            "75%": { transform: "translateX(4px)" },
          },
        }}
      />
    ),
    duration: 3000,
  },
  loading: {
    icon: (
      <LoadingIcon
        sx={{
          animation: "spin 1s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
    ),
    duration: Infinity,
  },
};

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");
  const [dimensions, setDimensions] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("root");
  const [folders, setFolders] = useState(["root"]);
  const [foldersLoading] = useState(true); // Remove setter if not used

  const getImageDimensions = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = url;
    });
  };

  // Update these functions to remove unnecessary notifications
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = async () => {
        setPreviewUrl(reader.result);
        const dims = await getImageDimensions(reader.result);
        setDimensions(dims);
        // Removed success toast - visual feedback is enough
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  // Update the handleUpload function to use the selected folder
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    const loadingToast = toast.loading("Uploading...");
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
      toast.success("Upload complete!");
      handleClear();
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss(loadingToast);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied!", {
      // Simplified message
      duration: 2000,
      icon: "📋",
    });
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDownloadUrl("");
    setImageName("");
    setDimensions(null);
    // Removed success toast - visual feedback is enough
  };

  const handleDelete = async (imagePath) => {
    const loadingToast = toast.loading("Deleting...");
    try {
      const fileRef = ref(configuredStorage, imagePath);
      await deleteObject(fileRef);
      toast.dismiss(loadingToast);
      toast.success("Image deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete");
    }
  };

  const handleOpenFileDialog = () => {
    setOpenFileDialog(true);
  };

  const handleCloseFileDialog = () => {
    setOpenFileDialog(false);
  };

  // Add this function after the existing state declarations
  const fetchBucketFolders = async () => {
    try {
      const storageRef = ref(configuredStorage);
      const result = await listAll(storageRef);

      // Get all items to check for folders
      const fetchPromises = result.items.map(async (item) => {
        const metadata = await getMetadata(item);
        const fullPath = metadata.fullPath;
        return fullPath.split("/")[0];
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
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Failed to load folders</Typography>
        </Box>,
        { ...toastConfig }
      );
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
        position="top-center"
        toastOptions={toastConfig}
        containerStyle={{
          top: 20,
        }}
        gutter={8}
      />
      <Paper sx={styles.paper}>
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
          sx: styles.dialogPaper,
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
