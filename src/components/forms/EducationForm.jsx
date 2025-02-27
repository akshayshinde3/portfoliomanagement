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
  Divider,
  Card,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { supabase } from "../../config/supabase";
import dayjs from "dayjs";
import { educationApi } from "../../api/SupabaseData";

// Add these style constants at the top of your component
const styles = {
  gradientText: {
    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  card: {
    p: 3,
    borderRadius: 3,
    backgroundColor: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    minHeight: "120px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#F8FAFC",
    borderRadius: 2,
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  },

  actionButton: {
    transition: "all 0.2s ease",
    borderRadius: "50%",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },

  dialogField: {
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
};

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

  const fetchEducations = async () => {
    try {
      console.log("Fetching educations...");
      const { data, error } = await supabase.from("education").select("*");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched education data:", data); // Debug log to see the actual data structure
      setEducations(data || []);
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error fetching education data: " + error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        !currentEducation.school ||
        !currentEducation.degree ||
        !currentEducation.date
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const educationData = {
        school: currentEducation.school,
        degree: currentEducation.degree,
        date: currentEducation.date,
        grade: currentEducation.grade || null,
        description: currentEducation.description || null,
        img: currentEducation.img || null,
      };

      if (editMode && currentEducation.id) {
        educationData.id = currentEducation.id;
      }

      console.log("Submitting education data:", educationData);

      const { error } = await supabase.from("education").upsert(educationData);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      await fetchEducations();
      handleClose();
      toast.success(
        editMode
          ? "Education updated successfully"
          : "Education added successfully"
      );
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error saving education: " + error.message);
    }
  };

  const handleDelete = (educationId) => {
    setItemToDelete({ id: educationId });
    setDeleteDialogOpen(true);
  };

  // Update handleConfirmDelete function
  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", itemToDelete.id); // Access the id property from itemToDelete object
      if (error) throw error;
      await fetchEducations();
      toast.success("Education deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error("Error deleting education: " + error.message);
    }
  };

  const handleEdit = (education) => {
    setCurrentEducation({
      ...education,
      date: education.date,
    });
    setEditMode(true);
    setOpen(true);
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
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        }}
      >
        <Box
          sx={{
            p: 4,
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  ...styles.gradientText,
                  background:
                    "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Education Details
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage your educational background
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
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

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {educations.map((education) => {
              console.log("Education entry:", education);
              return (
                <Grid item xs={12} key={education.id}>
                  <Card sx={styles.card}>
                    <Grid container spacing={3} alignItems="center">
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
                            <SchoolIcon
                              sx={{ fontSize: 40, color: "#94A3B8" }}
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#1E293B",
                            fontWeight: 600,
                            mb: 1,
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
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
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
                            onClick={() => handleDelete(education.id)}
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
              );
            })}
          </Grid>
        </Box>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
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
            px: 3,
            py: 2,
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
            p: 3,
            pt: 4,
            "&.MuiDialogContent-root": {
              paddingTop: "24px !important",
            },
          }}
        >
          {/* Update TextField components with the new styles */}
          <Grid container spacing={3}>
            {/* Add sx={styles.dialogField} to all TextField components */}
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

        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
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
              ...commonButtonSx,
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              },
            }}
          >
            {editMode ? "Save Changes" : "Add Education"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
            px: 3,
            py: 2,
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
              Delete Education
            </Typography>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography>
            Are you sure you want to delete this education?
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
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
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EducationForm;
