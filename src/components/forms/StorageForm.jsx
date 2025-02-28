import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Chip,
  Divider,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  FileCopy as FileCopyIcon,
  Storage as StorageIcon,
  CloudQueue as CloudIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { storage as configuredStorage } from "../../config/firebase";
import {
  ref,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  uploadBytes,
} from "firebase/storage";
import { Toaster, toast } from "react-hot-toast";

// Copy the styles object from ImageUploadForm
const styles = {
  // Main container and header styles
  gradientHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: 4,
    borderRadius: "16px 16px 0 0",
  },
  headerText: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    fontSize: { xs: "1.75rem", sm: "2rem" },
  },

  // Stats section styles
  statsContainer: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: 3,
    mb: 4,
  },
  statCard: {
    p: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
  },
  statValue: {
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
    fontWeight: 600,
    color: "#0F172A",
    mt: 1,
  },

  // Folder grid styles
  folderGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(auto-fill, minmax(200px, 1fr))",
      sm: "repeat(auto-fill, minmax(250px, 1fr))",
    },
    gap: 3,
    mb: 4,
  },
  folderCard: {
    p: 3,
    borderRadius: 2,
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
    transition: "all 0.2s ease",
    border: "1px solid",
    borderColor: "rgba(100, 116, 139, 0.12)",
    "&:hover": {
      backgroundColor: "#F8FAFC",
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: 2,
    backgroundColor: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
    transition: "all 0.2s ease",
    "& svg": {
      fontSize: 28,
      color: "#64748B",
    },
  },
  folderName: {
    fontWeight: 600,
    color: "#1E293B",
    fontSize: "0.925rem",
  },
  folderStats: {
    mt: 2,
    pt: 2,
    borderTop: "1px solid",
    borderColor: "rgba(100, 116, 139, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Table styles
  tableContainer: {
    mt: 4,
    borderRadius: 2,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    overflow: "auto",
    width: "100%",
    "& .MuiTable-root": {
      minWidth: "100%",
    },
    "&::-webkit-scrollbar": {
      height: 8,
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#F1F5F9",
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#CBD5E1",
      borderRadius: 4,
      "&:hover": {
        backgroundColor: "#94A3B8",
      },
    },
  },
  tableHeader: {
    backgroundColor: "#F8FAFC",
  },
  tableHeaderCell: {
    color: "#1E293B",
    fontWeight: 600,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    py: 2,
  },
  tableRow: {
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  },

  // Dialog styles
  dialogTitle: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: 3,
    py: 2,
  },
  dialogContent: {
    p: 3,
  },
  dialogActions: {
    px: 3,
    py: 2,
    borderTop: "1px solid",
    borderColor: "rgba(100, 116, 139, 0.12)",
  },

  // Button styles
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  uploadButton: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    "&:hover": {
      background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
    },
  },
  deleteButton: {
    color: "#EF4444",
    "&:hover": {
      backgroundColor: "#FEE2E2",
    },
  },

  // Input styles
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.2s ease",
    "&:focus": {
      borderColor: "#0F172A",
      boxShadow: "0 0 0 2px rgba(15, 23, 42, 0.1)",
    },
  },

  // Add these styles to your styles object
  dialogHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: 3,
    py: 2,
  },
  dialogHeaderContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogCloseButton: {
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
    },
  },
  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
  },
};

const dialogStyles = {
  uploadArea: {
    border: "2px dashed #CBD5E1",
    borderRadius: "8px",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#F8FAFC",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#94A3B8",
      backgroundColor: "#F1F5F9",
    },
  },
  fileInfo: {
    mt: 2,
    p: 2,
    borderRadius: "8px",
    backgroundColor: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  folderInput: {
    border: "2px solid #E2E8F0",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "#F8FAFC",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#94A3B8",
      backgroundColor: "#F1F5F9",
    },
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: "8px",
    backgroundColor: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
    "& svg": {
      fontSize: 28,
      color: "#64748B",
    },
  },
};

const StorageForm = () => {
  // Copy the state and functions related to bucket images from ImageUploadForm
  const [bucketImages, setBucketImages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("root");
  const [breadcrumbs, setBreadcrumbs] = useState(["root"]);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("root");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Copy the necessary functions from ImageUploadForm
  const fetchBucketImages = async () => {
    try {
      setLoading(true);
      const storageRef = ref(configuredStorage);
      const result = await listAll(storageRef);
      const allItems = [];

      // Get items from root
      for (const item of result.items) {
        allItems.push(item);
      }

      // Get items from all folders
      for (const folder of result.prefixes) {
        const folderResult = await listAll(folder);
        for (const item of folderResult.items) {
          allItems.push(item);
        }
      }

      const imagesData = await Promise.all(
        allItems.map(async (item) => {
          try {
            const url = await getDownloadURL(item);
            const metadata = await getMetadata(item);
            return {
              id: item.name,
              name: metadata.customMetadata?.customName || item.name,
              url: url,
              size: metadata.size,
              uploadTime: metadata.timeCreated,
              contentType: metadata.contentType,
              path: item.fullPath,
              folder: item.parent.fullPath || "root",
            };
          } catch (error) {
            console.error(`Error processing item ${item.name}:`, error);
            return null;
          }
        })
      );

      const validImages = imagesData.filter((image) => image !== null);
      validImages.sort(
        (a, b) => new Date(b.uploadTime) - new Date(a.uploadTime)
      );

      // Calculate total size and unique folders
      const totalBytes = validImages.reduce((sum, img) => sum + img.size, 0);
      setTotalSize(totalBytes);

      const uniqueFolders = [...new Set(validImages.map((img) => img.folder))];
      setFolders(uniqueFolders);

      setBucketImages(validImages);
    } catch (error) {
      console.error("Error fetching bucket images:", error);
      toast.error(`Failed to fetch images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const loadingToast = toast.loading("Loading storage data...");
      try {
        await fetchBucketImages();
        toast.dismiss(loadingToast);
        toast.success("Storage data loaded successfully!");
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error in useEffect:", error);
        toast.error("Failed to load storage data");
      }
    };

    fetchData();
  }, []);

  // ... copy other necessary functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    toast.success(`Page ${newPage + 1}`, {
      duration: 1000,
      icon: "📄",
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    toast.success(`Showing ${event.target.value} items per page`, {
      duration: 1000,
      icon: "📊",
    });
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!", {
      icon: "📋",
    });
  };

  const handleDelete = (image) => {
    setItemToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting file...");
    try {
      const fileRef = ref(configuredStorage, itemToDelete.path);
      await deleteObject(fileRef);
      await fetchBucketImages();
      toast.dismiss(loadingToast);
      toast.success("File deleted successfully!");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error deleting file:", error);
      toast.error(`Failed to delete file: ${error.message}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    const pathArray =
      folder === "root" ? ["root"] : ["root", ...folder.split("/")];
    setBreadcrumbs(pathArray);
    setPage(0);
    toast.success(`Navigated to ${folder === "root" ? "Home" : folder}`);
  };

  const handleBreadcrumbClick = (index) => {
    const newPath = breadcrumbs.slice(0, index + 1);
    const folder = newPath.length === 1 ? "root" : newPath.slice(1).join("/");
    setCurrentFolder(folder);
    setBreadcrumbs(newPath);
    setPage(0);
    toast.success(`Navigated to ${folder === "root" ? "Home" : folder}`);
  };

  const handleRename = async (event) => {
    event.preventDefault();
    if (!fileToRename || !newFileName.trim()) return;

    const loadingToast = toast.loading("Renaming file...");
    try {
      const oldRef = ref(configuredStorage, fileToRename.path);
      const newPath = fileToRename.path.replace(fileToRename.name, newFileName);
      const newRef = ref(configuredStorage, newPath);

      const response = await fetch(fileToRename.url);
      const blob = await response.blob();

      await uploadBytes(newRef, blob, {
        contentType: fileToRename.contentType,
        customMetadata: {
          ...fileToRename.customMetadata,
          customName: newFileName,
        },
      });

      await deleteObject(oldRef);
      await fetchBucketImages();
      toast.dismiss(loadingToast);
      toast.success("File renamed successfully!");
      handleCloseRenameDialog();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to rename file: ${error.message}`);
    }
  };

  const handleOpenRenameDialog = (file) => {
    setFileToRename(file);
    setNewFileName(file.name);
    setRenameDialogOpen(true);
  };

  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false);
    setFileToRename(null);
    setNewFileName("");
  };

  const handleOpenFolderDialog = () => setOpenFolderDialog(true);
  const handleCloseFolderDialog = () => setOpenFolderDialog(false);
  const handleOpenFileDialog = () => setOpenFileDialog(true);
  const handleCloseFileDialog = () => {
    setOpenFileDialog(false);
    setSelectedFile(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success("File selected successfully!");
    }
  };

  const handleCreateFolder = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const folderName = formData.get("folderName").trim();

    if (!folderName) {
      toast.error("Please enter a folder name");
      return;
    }

    const loadingToast = toast.loading("Creating folder...");
    try {
      const newFolder =
        currentFolder === "root"
          ? folderName
          : `${currentFolder}/${folderName}`;
      // Create an empty file to represent the folder
      const folderRef = ref(configuredStorage, `${newFolder}/.folder`);
      const emptyBlob = new Blob([""], { type: "text/plain" });
      await uploadBytes(folderRef, emptyBlob);

      await fetchBucketImages();
      toast.dismiss(loadingToast);
      toast.success("Folder created successfully!");
      handleCloseFolderDialog();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to create folder: ${error.message}`);
    }
  };

  const handleUploadFile = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const loadingToast = toast.loading("Uploading file...");
    try {
      const filePath =
        selectedFolder === "root"
          ? selectedFile.name
          : `${selectedFolder}/${selectedFile.name}`;

      const fileRef = ref(configuredStorage, filePath);
      await uploadBytes(fileRef, selectedFile);

      await fetchBucketImages();
      toast.dismiss(loadingToast);
      toast.success("File uploaded successfully!");
      handleCloseFileDialog();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to upload file: ${error.message}`);
    }
  };

  const Stats = () => {
    const currentFolderFiles = bucketImages.filter(
      (img) => img.folder === currentFolder
    );
    const folderSize = currentFolderFiles.reduce(
      (sum, img) => sum + img.size,
      0
    );

    // Assuming total storage limit is 1GB (1024 * 1024 * 1024 bytes)
    const totalStorage = 1024 * 1024 * 1024;
    const usedStorage = bucketImages.reduce((sum, img) => sum + img.size, 0);
    const remainingStorage = totalStorage - usedStorage;
    const usedPercentage = Math.round((usedStorage / totalStorage) * 100);

    return (
      <Box sx={styles.statsContainer}>
        <Paper sx={styles.statCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FileCopyIcon sx={{ color: "#64748B" }} />
            <Typography sx={styles.statLabel}>Files in Folder</Typography>
          </Box>
          <Typography sx={styles.statValue}>
            {currentFolderFiles.length}
          </Typography>
        </Paper>

        <Paper sx={styles.statCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <StorageIcon sx={{ color: "#64748B" }} />
            <Typography sx={styles.statLabel}>Folder Size</Typography>
          </Box>
          <Typography sx={styles.statValue}>
            {formatFileSize(folderSize)}
          </Typography>
        </Paper>

        <Paper sx={styles.statCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FolderIcon sx={{ color: "#64748B" }} />
            <Typography sx={styles.statLabel}>Total Folders</Typography>
          </Box>
          <Typography sx={styles.statValue}>{folders.length}</Typography>
        </Paper>

        <Paper sx={styles.statCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CloudIcon sx={{ color: "#64748B" }} />
            <Typography sx={styles.statLabel}>Storage Used</Typography>
          </Box>
          <Typography sx={styles.statValue}>
            {formatFileSize(usedStorage)} / {formatFileSize(totalStorage)}
          </Typography>
          <Box
            sx={{ mt: 1, width: "100%", bgcolor: "#F1F5F9", borderRadius: 1 }}
          >
            <Box
              sx={{
                width: `${usedPercentage}%`,
                height: 4,
                borderRadius: 1,
                bgcolor: usedPercentage > 90 ? "#EF4444" : "#10B981",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5 }}>
            {formatFileSize(remainingStorage)} remaining
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    // ... copy the bucket images table JSX from ImageUploadForm
    <Box sx={{ width: "100%", p: 3 }}>
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
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
          width: "100%",
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
                Storage
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage your uploaded files
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleOpenFileDialog}
                startIcon={<AddIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                  color: "#0F172A",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                  },
                }}
              >
                Upload File
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenFolderDialog}
                startIcon={<FolderIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                  color: "#0F172A",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                  },
                }}
              >
                New Folder
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4, width: "100%" }}>
          {/* Breadcrumbs navigation */}
          <Breadcrumbs sx={styles.breadcrumbs}>
            {breadcrumbs.map((crumb, index) => (
              <Typography
                key={crumb}
                sx={{
                  ...styles.breadcrumbLink,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  ...(index === breadcrumbs.length - 1 && {
                    className: "active",
                  }),
                }}
                onClick={() => handleBreadcrumbClick(index)}
              >
                {crumb === "root" ? (
                  <>
                    <HomeIcon sx={{ fontSize: 20 }} />
                    Home
                  </>
                ) : (
                  crumb
                )}
              </Typography>
            ))}
          </Breadcrumbs>

          <Stats />

          {/* Folder Grid */}
          {currentFolder === "root" && (
            <Box sx={styles.folderGrid}>
              {folders
                .filter((folder) => folder !== "root")
                .map((folder) => {
                  const filesCount = bucketImages.filter(
                    (img) => img.folder === folder
                  ).length;
                  const folderSize = bucketImages
                    .filter((img) => img.folder === folder)
                    .reduce((sum, img) => sum + img.size, 0);

                  return (
                    <Paper
                      key={folder}
                      sx={styles.folderCard}
                      onClick={() => handleFolderClick(folder)}
                    >
                      <Box sx={styles.folderIcon}>
                        <FolderIcon />
                      </Box>
                      <Typography noWrap sx={styles.folderName}>
                        {folder.split("/").pop()}
                      </Typography>
                      <Box sx={styles.folderStats}>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {filesCount} {filesCount === 1 ? "file" : "files"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {formatFileSize(folderSize)}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
            </Box>
          )}

          {/* Filter table contents based on current folder */}
          <TableContainer sx={styles.tableContainer}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow sx={styles.tableHeader}>
                  <TableCell sx={{ ...styles.tableHeaderCell, width: "10%" }}>
                    Preview
                  </TableCell>
                  <TableCell sx={{ ...styles.tableHeaderCell, width: "20%" }}>
                    File Name
                  </TableCell>
                  <TableCell sx={{ ...styles.tableHeaderCell, width: "15%" }}>
                    Folder
                  </TableCell>
                  <TableCell sx={{ ...styles.tableHeaderCell, width: "15%" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ ...styles.tableHeaderCell, width: "10%" }}>
                    Size
                  </TableCell>
                  <TableCell sx={{ ...styles.tableHeaderCell, width: "15%" }}>
                    Upload Date
                  </TableCell>
                  <TableCell
                    sx={{ ...styles.tableHeaderCell, width: "15%" }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bucketImages
                  .filter((image) => image.folder === currentFolder)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((image) => (
                    <TableRow key={image.id} sx={styles.tableRow}>
                      <TableCell sx={{ width: "10%" }}>
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
                      <TableCell sx={{ width: "20%" }}>
                        <Tooltip title={image.name}>
                          <Typography noWrap>{image.name}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        <Tooltip title={image.folder}>
                          <Typography noWrap>{image.folder}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        <Tooltip title={image.contentType}>
                          <Typography noWrap>{image.contentType}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        {formatFileSize(image.size)}
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        {new Date(image.uploadTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        <Tooltip title="Rename">
                          <IconButton
                            onClick={() => handleOpenRenameDialog(image)}
                            sx={{
                              color: "#1E293B",
                              "&:hover": {
                                backgroundColor: "#F1F5F9",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy URL">
                          <IconButton
                            onClick={() => handleCopyUrl(image.url)}
                            sx={{
                              color: "#1E293B",
                              "&:hover": {
                                backgroundColor: "#F1F5F9",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(image.path)}
                            sx={{
                              color: "#EF4444",
                              "&:hover": {
                                backgroundColor: "#FEE2E2",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.2s ease",
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={
              bucketImages.filter((image) => image.folder === currentFolder)
                .length
            }
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          />
        </Box>
      </Paper>
      <Dialog
        open={openFolderDialog}
        onClose={handleCloseFolderDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={styles.dialogTitle}>Create New Folder</DialogTitle>
        <form onSubmit={handleCreateFolder}>
          <DialogContent sx={{ mt: 2, px: 3, pb: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={dialogStyles.folderIcon}>
                  <FolderIcon />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Create a new folder to organize your files
                </Typography>
              </Box>

              <Box sx={dialogStyles.folderInput}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  Folder Name
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FolderIcon sx={{ color: "#64748B" }} />
                  <input
                    name="folderName"
                    type="text"
                    placeholder="Enter folder name"
                    autoComplete="off"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0F172A";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(15, 23, 42, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E2E8F0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Folder will be created in:{" "}
                  {currentFolder === "root" ? "Root" : currentFolder}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={handleCloseFolderDialog}
              sx={{
                color: "#64748B",
                "&:hover": { backgroundColor: "#F1F5F9" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                },
              }}
            >
              Create Folder
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openFileDialog}
        onClose={handleCloseFileDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={styles.dialogTitle}>Upload File</DialogTitle>
        <form onSubmit={handleUploadFile}>
          <DialogContent sx={{ mt: 2, px: 3, pb: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* File Upload Area */}
              <Box
                component="label"
                sx={{
                  ...dialogStyles.uploadArea,
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  accept="image/*"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AddIcon sx={{ fontSize: 40, color: "#64748B" }} />
                  <Typography variant="body1" color="text.secondary">
                    Click to select or drag and drop your file
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supported formats: PNG, JPG, GIF up to 10MB
                  </Typography>
                </Box>
              </Box>

              {/* Selected File Info */}
              {selectedFile && (
                <Box sx={dialogStyles.fileInfo}>
                  <Box
                    component="img"
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" noWrap>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedFile(null)}
                    sx={{ color: "#EF4444" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}

              {/* Folder Selection */}
              <FormControl fullWidth>
                <InputLabel>Destination Folder</InputLabel>
                <Select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  label="Destination Folder"
                >
                  <MenuItem value="root">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FolderIcon sx={{ color: "#64748B" }} />
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
                          {folder}
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button onClick={handleCloseFileDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!selectedFile}
              sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                },
              }}
            >
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={renameDialogOpen} onClose={handleCloseRenameDialog}>
        <DialogTitle sx={styles.dialogTitle}>Rename File</DialogTitle>
        <form onSubmit={handleRename}>
          <DialogContent sx={styles.dialogContent}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="New File Name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                variant="outlined"
                sx={styles.dialogField}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button onClick={handleCloseRenameDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!newFileName.trim()}
            >
              Rename
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
        <DialogTitle sx={styles.dialogHeader}>
          <Box sx={styles.dialogHeaderContent}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Delete File
            </Typography>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={styles.dialogCloseButton}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          {itemToDelete && (
            <>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box
                  component="img"
                  src={itemToDelete.url}
                  alt={itemToDelete.name}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {itemToDelete.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(itemToDelete.size)}
                  </Typography>
                </Box>
              </Box>
              <Typography>
                Are you sure you want to delete this file?
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
                This action cannot be undone.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={styles.deleteButton}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StorageForm;
