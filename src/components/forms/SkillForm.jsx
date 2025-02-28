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
} from "@mui/icons-material";
import { supabase } from "../../config/supabase";
import { skillsApi, skillCategoriesApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";

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
};

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

  useEffect(() => {
    fetchCategories();
    fetchSkills();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("title");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories: " + error.message);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select(
          `
          id,
          name,
          image,
          category_id,
          skill_categories (
            id,
            title
          )
        `
        )
        .order("name");

      if (error) throw error;

      const processedSkills =
        data?.map((skill) => ({
          ...skill,
          categoryTitle: skill.skill_categories?.title,
        })) || [];

      setSkills(processedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Error fetching skills: " + error.message);
    }
  };

  const handleSubmit = async (values) => {
    const loadingToast = toast.loading("Saving skill...");
    try {
      if (!currentSkill.name || !currentSkill.category_id) {
        toast.error("Please fill in required fields (Name and Category)");
        return;
      }

      const skillData = {
        name: currentSkill.name.trim(),
        category_id: currentSkill.category_id,
        image: currentSkill.image?.trim() || null,
        id: editMode ? currentSkill.id : undefined,
      };

      const { error } = await supabase.from("skills").upsert(skillData);

      if (error) throw error;

      await fetchSkills();
      handleClose();
      toast.dismiss(loadingToast);
      toast.success(
        editMode ? "Skill updated successfully" : "Skill added successfully"
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error saving skill:", error);
      toast.error("Error saving skill: " + error.message);
    }
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (skill) => {
    setItemToDelete(skill);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting skill...");
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", itemToDelete.id);

      if (error) throw error;

      await fetchSkills();
      toast.dismiss(loadingToast);
      toast.success("Skill deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error deleting skill:", error);
      toast.error("Error deleting skill: " + error.message);
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
    try {
      if (!currentCategory.title) {
        toast.error("Please enter a category title");
        return;
      }

      const { error } = await supabase.from("skill_categories").upsert({
        id: editingCategory ? currentCategory.id : undefined,
        title: currentCategory.title.trim(),
      });

      if (error) throw error;

      await fetchCategories();
      handleCategoryClose();
      toast.success(
        editingCategory
          ? "Category updated successfully"
          : "Category added successfully"
      );
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error saving category: " + error.message);
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
  };

  const handleConfirmCategoryDelete = async () => {
    try {
      const { error: updateError } = await supabase
        .from("skills")
        .update({ category_id: null })
        .eq("category_id", categoryToDelete.id);

      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from("skill_categories")
        .delete()
        .eq("id", categoryToDelete.id);

      if (deleteError) throw deleteError;

      await fetchCategories();
      await fetchSkills();
      toast.success("Category deleted successfully");
      setCategoryDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error("Error deleting category: " + error.message);
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
                              onClick={() => handleDelete(skill)} // Pass the entire skill object instead of just skill.id
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
                        onClick={() => handleDeleteCategory(category.id)}
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
              Delete Skill
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
          <Typography>Are you sure you want to delete this skill?</Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
            This action cannot be undone.
          </Typography>
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

      <Dialog
        open={categoryDeleteDialogOpen}
        onClose={() => setCategoryDeleteDialogOpen(false)}
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
              Delete Category
            </Typography>
            <IconButton
              onClick={() => setCategoryDeleteDialogOpen(false)}
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
            Are you sure you want to delete this category?
          </Typography>
          {categoryToDelete?.skillCount > 0 && (
            <Typography sx={{ color: "#EF4444", mt: 1 }}>
              This category contains {categoryToDelete.skillCount} skills. These
              skills will be uncategorized.
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={() => setCategoryDeleteDialogOpen(false)}
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
            onClick={handleConfirmCategoryDelete}
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
    </Box>
  );
};

export default SkillForm;
