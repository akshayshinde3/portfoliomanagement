import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Card,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  Sync as LoadingIcon,
} from "@mui/icons-material";
import { educationApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";
import { styled } from "@mui/material/styles";
import { Warning as WarningIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useScrollLock } from "../../hooks/useScrollLock";

// Add these responsive styles to your existing styles object
const styles = {
  gradientText: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },

  card: {
    p: { xs: 2, sm: 3 },
    borderRadius: "16px",
    backgroundColor: "white",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(241, 245, 249, 0.1)",
    backdropFilter: "blur(20px)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
    "& .MuiGrid-container": {
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: { xs: 2, sm: 3 },
    },
  },

  imageContainer: {
    position: "relative",
    width: { xs: "100%", sm: "100%" },
    minHeight: { xs: 100, sm: 120 },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#F8FAFC",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    maxWidth: { xs: 200, sm: "100%" },
    margin: { xs: "0 auto", sm: 0 },
  },

  actionButton: {
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "12px",
    padding: "8px",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },

  dialogField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      transition: "all 0.2s ease",
      backgroundColor: "#F8FAFC",
      "&:hover": {
        backgroundColor: "#F1F5F9",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#94A3B8",
          borderWidth: "2px",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "#F1F5F9",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#0F172A",
          borderWidth: "2px",
        },
      },
      minHeight: { xs: "44px", sm: "48px" },
      fontSize: { xs: "0.875rem", sm: "1rem" },
    },
    "& .MuiInputLabel-root": {
      color: "#64748B",
      "&.Mui-focused": {
        color: "#0F172A",
      },
      fontSize: { xs: "0.875rem", sm: "1rem" },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 1,
      color: "#94A3B8",
    },
  },

  container: {
    maxWidth: "100%",
    margin: "0 auto",
    p: { xs: 2, sm: 3 },
    "@media (min-width: 1200px)": {
      maxWidth: 1200,
    },
  },

  paper: {
    borderRadius: { xs: 2, sm: 4 },
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
  },

  header: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: { xs: 2.5, sm: 4 },
  },

  headerTitle: {
    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
    lineHeight: { xs: 1.3, sm: 1.4 },
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },

  schoolInfo: {
    textAlign: { xs: "center", sm: "left" },
    mb: { xs: 2, sm: 0 },
  },

  actionButtons: {
    justifyContent: { xs: "center", sm: "flex-end" },
    mt: { xs: 2, sm: 0 },
  },
  dialogContent: {
    p: 3,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
  },
  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 500,
    px: 3,
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
      transform: "translateY(-2px)",
    },
    transition: "all 0.2s ease-in-out",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(239,68,68,0.2)",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(239,68,68,0.3)",
    },
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Add new common button styles
const buttonStyles = {
  addButton: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    fontWeight: 600,
    px: { xs: 2, sm: 3 },
    py: { xs: 1, sm: 1.5 },
    borderRadius: "12px",
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
    "&:hover": {
      background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(255,255,255,0.2)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },

  dialogButton: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Update Dialog PaperProps
const dialogPaperProps = {
  sx: {
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(241, 245, 249, 0.1)",
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 800 },
    m: { xs: 2, sm: 4 },
  },
};

// Update Dialog title styles
const dialogTitleStyles = {
  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
  color: "white",
  px: 3,
  py: 2.5,
  "& .MuiTypography-root": {
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
};

// Update Dialog content styles
const dialogContentStyles = {
  p: 3,
  pt: 4,
  "&.MuiDialogContent-root": {
    paddingTop: "24px !important",
  },
  backgroundColor: "#FFFFFF",
};

// Update Dialog actions styles
const dialogActionsStyles = {
  p: 3,
  backgroundColor: "#F8FAFC",
  borderTop: "1px solid rgba(226, 232, 240, 0.8)",
};

// Update the dialog styles to match ExperienceForm
const dialogStyles = {
  paper: {
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 800 },
    m: { xs: 2, sm: 4 },
    borderRadius: { xs: 2, sm: 3 },
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
  },
  content: {
    p: { xs: 2.5, sm: 3 },
    pt: { xs: 3, sm: 4 },
    mt: 1,
    "& .MuiTextField-root": {
      mb: { xs: 2, sm: 2.5 },
    },
  },
  header: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: 3,
    py: 2.5,
  },
  actions: {
    p: 3,
    backgroundColor: "#F8FAFC",
    borderTop: "1px solid rgba(226, 232, 240, 0.8)",
  },
};

// Add toast configuration
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
    style: {
      background: "rgba(16, 185, 129, 0.95)",
    },
    duration: 2000, // 2 seconds for success messages
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
    style: {
      background: "rgba(239, 68, 68, 0.95)",
    },
    duration: 3000, // 3 seconds for error messages
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
    style: {
      background: "rgba(30, 41, 59, 0.95)",
    },
    duration: 10000, // 10 seconds maximum for loading state
  },
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(241, 245, 249, 0.2);
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 8%) 0px 20px 40px, rgb(0 0 0 / 6%) 0px 1px 3px;
    overflow: hidden;
  }
`;

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
  color: "white",
  padding: "24px",
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
}));

const EducationForm = () => {
  const [educations, setEducations] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    school: "",
    degree: "",
    date: "",
    grade: "",
    description: "",
    img: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { enableBodyScroll, disableBodyScroll } = useScrollLock();

  const commonButtonSx = {
    backgroundColor: "#0F172A",
    "&:hover": { backgroundColor: "#1E293B" },
    borderRadius: 2,
    textTransform: "none",
    px: 3,
    py: 1,
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  useEffect(() => {
    console.log("Current education state:", currentEducation);
  }, [currentEducation]);

  useEffect(() => {
    console.log("Educations array:", educations);
  }, [educations]);

  useEffect(() => {
    console.log("Current educations:", educations);
  }, [educations]);

  // Update the fetchEducations function
  const fetchEducations = async () => {
    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>Loading education details...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      const data = await educationApi.fetch();
      setEducations(data || []);

      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Information loaded successfully</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast, // Replace loading toast with success
          duration: 2000,
        }
      );
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Failed to load education details</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast, // Replace loading toast with error
        }
      );
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    if (
      !currentEducation.school ||
      !currentEducation.degree ||
      !currentEducation.date
    ) {
      toast.error("Please fill in all required fields", {
        ...toastConfig,
        duration: 2000,
      });
      return;
    }

    const loadingToast = toast.loading(
      `${editMode ? "Updating" : "Adding"} education...`
    );

    try {
      // Structure the data to match database schema exactly
      const educationData = {
        school: currentEducation.school.trim(),
        degree: currentEducation.degree.trim(),
        date: currentEducation.date.trim(),
        grade: currentEducation.grade?.trim() || null,
        description: currentEducation.description?.trim() || null,
        img: currentEducation.img?.trim() || null,
      };

      if (editMode && currentEducation.id) {
        // Pass id and update data separately
        await educationApi.update(currentEducation.id, educationData);
      } else {
        await educationApi.create(educationData);
      }

      await fetchEducations();
      toast.dismiss(loadingToast);
      toast.success(
        `${editMode ? "Updated" : "Added"} education successfully`,
        {
          ...toastConfig,
          duration: 2000,
        }
      );
      handleClose();
    } catch (error) {
      console.error("Error details:", error);
      toast.dismiss(loadingToast);
      toast.error(
        `Failed to ${editMode ? "update" : "add"} education: ${error.message}`,
        {
          ...toastConfig,
          duration: 3000,
        }
      );
    }
  };

  // Update the handleConfirmDelete function
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const loadingToast = toast.loading("Deleting education entry...");
    try {
      await educationApi.delete(itemToDelete.id);
      await fetchEducations();
      toast.dismiss(loadingToast);
      toast.success("Education deleted successfully");
      handleCloseDelete(); // Use this instead of direct setState calls
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Error deleting education: ${error.message}`);
    }
  };

  // Also update the handleEdit function to properly structure the data
  const handleEdit = (education) => {
    setCurrentEducation({
      id: education.id,
      school: education.school,
      degree: education.degree,
      date: education.date,
      grade: education.grade || "",
      description: education.description || "",
      img: education.img || "",
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    disableBodyScroll();
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    enableBodyScroll();
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentEducation({
      school: "",
      degree: "",
      date: "",
      grade: "",
      description: "",
      img: "",
    });
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Box sx={styles.header}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h4" sx={styles.headerTitle}>
                Education Details
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#94A3B8",
                  mt: 1,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Manage your educational background
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditMode(false);
                setOpen(true);
              }}
              sx={{
                background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                color: "#0F172A",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(255,255,255,0.2)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Add Education
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {educations.map((education) => (
              <Grid item xs={12} key={education.id}>
                <Card sx={styles.card}>
                  <Grid container spacing={0}>
                    {/* Image Section */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={styles.imageContainer}>
                        {education.img ? (
                          <Box
                            component="img"
                            src={education.img}
                            alt={education.school}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              p: 2,
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            }}
                            onError={(e) => {
                              console.log(
                                "Image load error for:",
                                education.school
                              );
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/100?text=No+Image";
                            }}
                          />
                        ) : (
                          <SchoolIcon sx={{ fontSize: 40, color: "#94A3B8" }} />
                        )}
                      </Box>
                    </Grid>

                    {/* Content Section */}
                    <Grid item xs={12} sm={8}>
                      <Box sx={styles.schoolInfo}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#1E293B",
                            fontWeight: 600,
                            mb: 1,
                            ...styles.schoolInfo,
                          }}
                        >
                          {education.school}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#475569",
                            fontWeight: 500,
                            mb: 0.5,
                          }}
                        >
                          {education.degree}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#64748B" }}>
                            {education.date}
                          </Typography>
                          {education.grade && (
                            <>
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  backgroundColor: "#CBD5E1",
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: "#64748B" }}
                              >
                                Grade: {education.grade}
                              </Typography>
                            </>
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                          {education.description}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Actions Section */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={styles.actionButtons}>
                        <IconButton
                          onClick={() => handleEdit(education)}
                          sx={{
                            ...styles.actionButton,
                            color: "#0F172A",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(education)}
                          sx={{
                            ...styles.actionButton,
                            color: "#EF4444",
                            "&:hover": {
                              backgroundColor: "#FEE2E2",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Add Fab for mobile */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
      >
        <Fab
          color="primary"
          aria-label="add education"
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Main Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: dialogStyles.paper,
        }}
      >
        <DialogTitle sx={dialogStyles.header}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editMode ? "Edit Education" : "Add Education"}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            ...dialogStyles.content,
            "&.MuiDialogContent-root": {
              paddingTop: "24px !important",
            },
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Logo URL"
                value={currentEducation.img || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    img: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
              {currentEducation.img && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <img
                    src={currentEducation.img}
                    alt="School Logo"
                    style={{
                      maxHeight: 200,
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="School Name"
                value={currentEducation.school || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    school: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Degree"
                value={currentEducation.degree || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    degree: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Date"
                value={currentEducation.date || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    date: e.target.value,
                  })
                }
                helperText="e.g., Apr 2017 - Apr 2021"
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Grade"
                value={currentEducation.grade || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    grade: e.target.value,
                  })
                }
                helperText="e.g., 75.00%"
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={currentEducation.description || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    description: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogStyles.actions}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: "#E2E8F0",
              color: "#64748B",
              "&:hover": {
                borderColor: "#CBD5E1",
                backgroundColor: "#F1F5F9",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              },
            }}
          >
            {editMode ? "Save Changes" : "Add Education"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <StyledDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        disableScrollLock={false}
        onBackdropClick={handleCloseDelete}
        PaperProps={{
          sx: {
            m: 2,
            maxHeight: "calc(100% - 64px)",
          },
        }}
      >
        <StyledDialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <DeleteIcon sx={{ color: "#EF4444" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Delete Education
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseDelete}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </StyledDialogTitle>

        <DialogContent sx={styles.dialogContent}>
          {itemToDelete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2.5,
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    backgroundColor: "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {itemToDelete.img ? (
                    <Box
                      component="img"
                      src={itemToDelete.img}
                      alt={itemToDelete.school}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        p: 2,
                      }}
                    />
                  ) : (
                    <SchoolIcon sx={{ fontSize: 40, color: "#94A3B8" }} />
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1E293B", mb: 0.5 }}
                  >
                    {itemToDelete.school}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    {itemToDelete.degree}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#94A3B8", display: "block", mt: 1 }}
                  >
                    {itemToDelete.date}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{ color: "#1E293B", mb: 2, fontWeight: 500 }}
              >
                Are you sure you want to delete this education entry?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                ⚠️ This action cannot be undone. The education entry will be
                permanently removed.
              </Typography>
            </motion.div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: "#F8FAFC",
            borderTop: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Button
            onClick={handleCloseDelete}
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
            Delete Education
          </Button>
        </DialogActions>
      </StyledDialog>

      <Toaster
        position="top-center"
        toastOptions={toastConfig}
        containerStyle={{
          top: 20,
        }}
        gutter={8}
      />
    </Box>
  );
};

export default EducationForm;
