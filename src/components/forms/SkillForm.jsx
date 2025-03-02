import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Sync as LoadingIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { skillsApi, skillCategoriesApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useScrollLock } from "../../hooks/useScrollLock";

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

  skillCard: {
    p: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 3,
    border: "1px solid",
    borderColor: "grey.200",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 2,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#F8FAFC",
    border: "1px solid",
    borderColor: "grey.100",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
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

  categoryPaper: {
    mt: 4,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
  },

  categoryCard: {
    p: 3,
    borderRadius: 3,
    backgroundColor: "white",
    transition: "all 0.3s ease",
    border: "1px solid",
    borderColor: "grey.200",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
  },

  categoryHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: 4,
  },

  dialogHeader: {
    background: "linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%)",
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
  dialogContent: {
    p: 3,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
  },
};

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

const SkillForm = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSkill, setCurrentSkill] = useState({
    name: "",
    image: "",
    category_id: "",
  });
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ title: "" });
  const [editingCategory, setEditingCategory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [categoryDeleteDialogOpen, setCategoryDeleteDialogOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { enableBodyScroll, disableBodyScroll } = useScrollLock();

  useEffect(() => {
    fetchCategories();
    fetchSkills();
  }, []);

  const fetchCategories = async () => {
    const loadingToast = toast.loading("Loading categories...", toastConfig);
    try {
      const data = await skillCategoriesApi.fetch();
      setCategories(data || []);
      toast.dismiss(loadingToast);
      toast.success("Categories loaded successfully", toastConfig);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories: " + error.message, toastConfig);
    }
  };

  const fetchSkills = async () => {
    const loadingToast = toast.loading("Loading skills...", toastConfig);
    try {
      const data = await skillsApi.fetchWithCategories();
      setSkills(data || []);
      toast.dismiss(loadingToast);
      toast.success("Skills loaded successfully", toastConfig);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error fetching skills:", error);
      toast.error("Error fetching skills: " + error.message, toastConfig);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading("Saving skill...", toastConfig);

    try {
      if (!currentSkill.name || !currentSkill.category_id) {
        toast.dismiss(loadingToast);
        toast.error("Please fill in all required fields", toastConfig);
        return;
      }

      const skillData = {
        name: currentSkill.name.trim(),
        category_id: currentSkill.category_id,
        image: currentSkill.image || null,
      };

      if (editMode) {
        skillData.id = currentSkill.id;
        await skillsApi.update(skillData);
      } else {
        await skillsApi.create(skillData);
      }

      await fetchSkills();
      handleClose();
      toast.dismiss(loadingToast);
      toast.success(
        editMode ? "Skill updated successfully" : "Skill added successfully",
        toastConfig
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error saving skill: " + error.message, toastConfig);
    }
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
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

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting skill...", toastConfig);
    try {
      await skillsApi.delete(itemToDelete.id);
      await fetchSkills();
      toast.dismiss(loadingToast);
      toast.success("Skill deleted successfully", toastConfig);
      handleCloseDelete(); // Use this instead of setDeleteDialogOpen(false)
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error deleting skill: " + error.message, toastConfig);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentSkill({
      name: "",
      image: "",
      category_id: "",
    });
  };

  const handleCategorySubmit = async () => {
    const loadingToast = toast.loading("Saving category...", toastConfig);
    try {
      if (!currentCategory.title) {
        toast.dismiss(loadingToast);
        toast.error("Please enter a category title", toastConfig);
        return;
      }

      if (editingCategory) {
        await skillCategoriesApi.update({
          id: currentCategory.id,
          title: currentCategory.title.trim(),
        });
      } else {
        await skillCategoriesApi.create({
          title: currentCategory.title.trim(),
        });
      }

      await fetchCategories();
      handleCategoryClose();
      toast.dismiss(loadingToast);
      toast.success(
        editingCategory
          ? "Category updated successfully"
          : "Category added successfully",
        toastConfig
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error saving category: " + error.message, toastConfig);
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setEditingCategory(true);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId, skillCount) => {
    setCategoryToDelete({ id: categoryId, skillCount });
    setCategoryDeleteDialogOpen(true);
    disableBodyScroll();
  };

  const handleCloseCategoryDelete = () => {
    setCategoryDeleteDialogOpen(false);
    setCategoryToDelete(null);
    enableBodyScroll();
  };

  const handleConfirmCategoryDelete = async () => {
    const loadingToast = toast.loading("Deleting category...", toastConfig);
    try {
      await skillsApi.updateCategoryNull(categoryToDelete.id);
      await skillCategoriesApi.delete(categoryToDelete.id);
      await fetchCategories();
      await fetchSkills();
      toast.dismiss(loadingToast);
      toast.success("Category deleted successfully", toastConfig);
      handleCloseCategoryDelete(); // Use this instead of direct setState calls
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error deleting category: " + error.message, toastConfig);
    }
  };

  const handleCategoryClose = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(false);
    setCurrentCategory({ title: "" });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
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
                Skills
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage your skills and technologies
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
              Add Skill
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {categories.map((category) => (
            <Box key={category.id} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: "#1E293B", mb: 2 }}>
                {category.title}
              </Typography>
              <Grid container spacing={2}>
                {skills
                  .filter((skill) => skill.category_id === category.id)
                  .map((skill) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={skill.id}>
                      <Card sx={styles.skillCard}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Box sx={styles.iconContainer}>
                            {skill.image && (
                              <img
                                src={skill.image}
                                alt={skill.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(skill)}
                              sx={{
                                color: "#1E293B",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#F1F5F9",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(skill)}
                              sx={{
                                color: "#EF4444",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#FEE2E2",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#1E293B",
                            fontWeight: 600,
                          }}
                        >
                          {skill.name}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper sx={styles.categoryPaper}>
        <Box sx={styles.categoryHeader}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" sx={styles.headerText}>
                Skill Categories
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Organize your skills into categories
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCategoryDialogOpen(true)}
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
              Add Category
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card sx={styles.categoryCard}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#1E293B",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748B" }}>
                        {
                          skills.filter(
                            (skill) => skill.category_id === category.id
                          ).length
                        }{" "}
                        skills
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(category)}
                        sx={{
                          color: "#1E293B",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#F1F5F9",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDeleteCategory(
                            category.id,
                            skills.filter(
                              (skill) => skill.category_id === category.id
                            ).length
                          )
                        }
                        sx={{
                          color: "#EF4444",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#FEE2E2",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
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
              {editMode ? "Edit Skill" : "Add Skill"}
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Skill Name"
                value={currentSkill.name || ""}
                onChange={(e) =>
                  setCurrentSkill({ ...currentSkill, name: e.target.value })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required sx={styles.dialogField}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={currentSkill.category_id || ""}
                  label="Category"
                  onChange={(e) =>
                    setCurrentSkill({
                      ...currentSkill,
                      category_id: e.target.value,
                    })
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skill Icon URL"
                value={currentSkill.image || ""}
                onChange={(e) =>
                  setCurrentSkill({ ...currentSkill, image: e.target.value })
                }
                sx={styles.dialogField}
              />
              {currentSkill.image && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#F8FAFC",
                    }}
                  >
                    <img
                      src={currentSkill.image}
                      alt="Skill Icon Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={styles.cancelButton}
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
            {editMode ? "Save Changes" : "Add Skill"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={categoryDialogOpen}
        onClose={handleCategoryClose}
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
              {editingCategory ? "Edit Category" : "Add Category"}
            </Typography>
            <IconButton
              onClick={handleCategoryClose}
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
          <TextField
            fullWidth
            required
            label="Category Title"
            value={currentCategory.title || ""}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, title: e.target.value })
            }
            sx={styles.dialogField}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={handleCategoryClose}
            variant="outlined"
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCategorySubmit}
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
            {editingCategory ? "Save Changes" : "Add Category"}
          </Button>
        </DialogActions>
      </Dialog>

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
                Delete Skill
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
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box sx={{ display: "flex", gap: 2.5 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      backgroundColor: "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {itemToDelete.image ? (
                      <Box
                        component="img"
                        src={itemToDelete.image}
                        alt={itemToDelete.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          p: 1,
                        }}
                      />
                    ) : (
                      <CodeIcon sx={{ fontSize: 32, color: "#94A3B8" }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1E293B", mb: 0.5 }}
                    >
                      {itemToDelete.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      Category:{" "}
                      {categories.find((c) => c.id === itemToDelete.category_id)
                        ?.title || "Uncategorized"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{ color: "#1E293B", mb: 2, fontWeight: 500 }}
              >
                Are you sure you want to delete this skill?
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
                ⚠️ This action cannot be undone. The skill will be permanently
                removed.
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
            Delete Skill
          </Button>
        </DialogActions>
      </StyledDialog>

      <StyledDialog
        open={categoryDeleteDialogOpen}
        onClose={handleCloseCategoryDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        disableScrollLock={false}
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
                Delete Category
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseCategoryDelete}
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
          {categoryToDelete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1E293B", mb: 1 }}
                  >
                    {
                      categories.find((c) => c.id === categoryToDelete.id)
                        ?.title
                    }
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    {categoryToDelete.skillCount} skills in this category
                  </Typography>
                </Box>

                {categoryToDelete.skillCount > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#EF4444" }}>
                      ⚠️ This category contains {categoryToDelete.skillCount}{" "}
                      skills. These skills will be uncategorized.
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography
                variant="body1"
                sx={{ color: "#1E293B", mb: 2, fontWeight: 500 }}
              >
                Are you sure you want to delete this category?
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
                ⚠️ This action cannot be undone. The category will be
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
            onClick={handleCloseCategoryDelete}
            variant="outlined"
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmCategoryDelete}
            variant="contained"
            sx={styles.deleteButton}
          >
            Delete Category
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

export default SkillForm;
