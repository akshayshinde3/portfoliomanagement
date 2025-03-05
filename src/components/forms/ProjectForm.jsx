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
  Chip,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  GitHub as GitHubIcon,
  Dashboard as DashboardIcon,
  LinkedIn as LinkedInIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  Sync as LoadingIcon,
} from "@mui/icons-material";
import {
  projectsApi,
  projectMembersApi,
  projectAssociationsApi,
} from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "../../config/supabase";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollLock } from "../../hooks/useScrollLock";

// Add these styled components at the top of your file
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

// Add these responsive styles
const styles = {
  container: {
    width: "100%",
    p: { xs: 2, sm: 3 },
    maxWidth: {
      xs: "100%",
      lg: 1200,
    },
    mx: "auto",
  },

  paper: {
    borderRadius: { xs: 2, sm: 4 },
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  gradientHeader: {
    p: { xs: 2.5, sm: 4 },
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
  },

  headerText: {
    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
    lineHeight: { xs: 1.3, sm: 1.4 },
    fontWeight: 700,
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  projectCard: {
    p: { xs: 2, sm: 3 },
    "& .MuiGrid-container": {
      flexDirection: { xs: "column", sm: "row" },
    },
  },

  imageContainer: {
    height: { xs: "200px", sm: "200px" },
    width: "100%",
    mb: { xs: 2, sm: 0 },
  },

  contentSection: {
    pl: { xs: 0, sm: 3 },
  },

  dialogContent: {
    p: { xs: 2, sm: 3 },
    "& .MuiGrid-container": {
      "& .MuiGrid-item": {
        width: { xs: "100%", sm: "auto" },
      },
    },
    p: 3,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
  },

  buttonContainer: {
    display: { xs: "none", sm: "block" },
  },

  fabButton: {
    position: "fixed",
    bottom: 20,
    right: 20,
    display: { xs: "flex", sm: "none" },
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    },
  },

  dialogField: {
    "& .MuiOutlinedInput-root": {
      minHeight: { xs: "44px", sm: "48px" },
      fontSize: { xs: "0.875rem", sm: "1rem" },
    },
    "& .MuiInputLabel-root": {
      fontSize: { xs: "0.875rem", sm: "1rem" },
    },
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

// Add this near your other styles
const chipStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: { xs: 1, sm: 1.5 },
  mt: 2,
  "& .MuiChip-root": {
    height: { xs: 32, sm: 36 },
    borderRadius: { xs: "10px", sm: "12px" },
    fontSize: { xs: "0.813rem", sm: "0.875rem" },
    "& .MuiChip-label": {
      px: { xs: 2, sm: 3 },
    },
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
    duration: Infinity,
  },
};

const ProjectForm = () => {
  const { enableBodyScroll, disableBodyScroll } = useScrollLock();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    title: "",
    description: "",
    description2: "",
    description3: "",
    image: "",
    tags: [],
    category: "",
    github: "",
    dashboard: "",
  });
  const [members, setMembers] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    img: "",
    github: "",
    linkedin: "",
  });
  const [newAssociation, setNewAssociation] = useState({
    name: "",
    img: "",
  });
  const [categories, setCategories] = useState([]);

  // Add new state for category management
  const [newCategory, setNewCategory] = useState("");
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Add this common button style
  const commonButtonSx = {
    backgroundColor: "#0F172A",
    "&:hover": { backgroundColor: "#1E293B" },
    borderRadius: 2,
    textTransform: "none",
    px: 4,
    minWidth: { xs: "100%", sm: "auto" },
    height: 42,
    fontSize: "0.875rem",
  };

  // Add at the top with other state variables
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Add this to your state declarations
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  // Update the fetchProjects function
  const fetchProjects = async () => {
    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>Loading projects...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      const projectsData = await projectsApi.fetch();

      // Fetch relations for each project
      const projectsWithRelations = await Promise.all(
        projectsData.map(async (project) => {
          const members = await projectMembersApi.fetchByProjectId(project.id);
          const associations = await projectAssociationsApi.fetchByProjectId(
            project.id
          );

          return {
            ...project,
            members: members || [],
            associations: associations || [],
          };
        })
      );

      console.log("Fetched projects with relations:", projectsWithRelations);
      setProjects(projectsWithRelations);
      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Projects loaded successfully</Typography>
        </Box>,
        { ...toastConfig, id: loadingToast }
      );
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Failed to load projects</Typography>
        </Box>,
        { ...toastConfig, id: loadingToast }
      );
    }
  };

  // Replace the fetchCategories function
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      // Remove duplicates and null values
      const uniqueCategories = [
        ...new Set(data.map((item) => item.category)),
      ].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories: " + error.message);
    }
  };

  // Add this function to handle category editing
  const handleEditCategory = (category) => {
    setNewCategory(category);
    setEditingCategory(category);
    setOpenCategoryDialog(true);
  };

  // Update the handleSubmit function to handle relations correctly
  const handleSubmit = async () => {
    if (!currentProject.title || !currentProject.description) {
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Please fill in all required fields</Typography>
        </Box>,
        { ...toastConfig }
      );
      return;
    }

    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>{editMode ? "Updating" : "Adding"} project...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      const projectData = {
        title: currentProject.title,
        description: currentProject.description,
        description2: currentProject.description2,
        description3: currentProject.description3,
        image: currentProject.image,
        tags: currentProject.tags,
        category: currentProject.category,
        github: currentProject.github,
        dashboard: currentProject.dashboard,
      };

      // Save or update project
      const savedProject = editMode
        ? await projectsApi.update({ ...projectData, id: currentProject.id })
        : await projectsApi.create(projectData);

      // Handle members
      if (editMode) {
        await projectMembersApi.deleteByProjectId(savedProject.id);
      }

      if (members.length > 0) {
        await projectMembersApi.createMany(
          members.map((member) => ({
            ...member,
            project_id: savedProject.id,
          }))
        );
      }

      // Handle associations
      if (editMode) {
        await projectAssociationsApi.deleteByProjectId(savedProject.id);
      }

      if (associations.length > 0) {
        await projectAssociationsApi.createMany(
          associations.map((association) => ({
            ...association,
            project_id: savedProject.id,
          }))
        );
      }

      await fetchProjects();
      handleClose();
      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>
            Project {editMode ? "updated" : "added"} successfully
          </Typography>
        </Box>,
        { ...toastConfig, id: loadingToast }
      );
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>
            Failed to {editMode ? "update" : "add"} project
          </Typography>
        </Box>,
        { ...toastConfig, id: loadingToast }
      );
    }
  };

  // Update the handleEdit function
  const handleEdit = async (project) => {
    try {
      setCurrentProject({
        ...project,
        tags: Array.isArray(project.tags) ? project.tags : [],
      });
      setEditMode(true);

      // Set members and associations from project data if they exist
      if (project.members && Array.isArray(project.members)) {
        setMembers(project.members);
      }

      if (project.associations && Array.isArray(project.associations)) {
        setAssociations(project.associations);
      }

      setOpen(true);
    } catch (error) {
      console.error("Error loading project details:", error);
      toast.error("Error loading project details: " + error.message);
    }
  };

  // Update handleDelete function
  const handleDelete = (project) => {
    setItemToDelete(project);
    setDeleteDialogOpen(true);
    disableBodyScroll();
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentProject({
      title: "",
      description: "",
      description2: "",
      description3: "",
      image: "",
      tags: [],
      category: "",
      github: "",
      dashboard: "",
    });
    setMembers([]);
    setAssociations([]);
    setNewMember({ name: "", img: "", github: "", linkedin: "" });
    setNewAssociation({ name: "", img: "" });
  };

  // Add new function to handle member editing
  const handleEditMember = (member) => {
    setNewMember({
      id: member.id,
      name: member.name,
      img: member.img,
      github: member.github || "",
      linkedin: member.linkedin || "",
    });
  };

  // Update handleAddMember to handle both add and edit
  const handleAddMember = async () => {
    try {
      const memberData = {
        ...newMember,
        project_id: currentProject.id,
      };

      // If member has an ID, update existing member
      if (newMember.id) {
        const updatedMembers = members.map((m) =>
          m.id === newMember.id ? { ...memberData } : m
        );
        setMembers(updatedMembers);
      } else {
        // Add new member
        const newMemberWithId = {
          ...memberData,
          id: Date.now(), // Temporary ID for new members
        };
        setMembers([...members, newMemberWithId]);
      }

      // Reset form
      setNewMember({ name: "", img: "", github: "", linkedin: "" });
      toast.success(
        newMember.id
          ? "Member updated successfully"
          : "Member added successfully"
      );
    } catch (error) {
      toast.error("Error managing member: " + error.message);
    }
  };

  // Update the handleDeleteMember function
  const handleDeleteMember = async (memberId) => {
    try {
      await projectMembersApi.delete(memberId);
      const updatedMembers = members.filter((member) => member.id !== memberId);
      setMembers(updatedMembers);
      toast.success("Member deleted successfully");
    } catch (error) {
      toast.error("Error deleting member: " + error.message);
    }
  };

  // Add new function to handle association editing
  const handleEditAssociation = (association) => {
    setNewAssociation({
      id: association.id,
      name: association.name,
      img: association.img,
    });
  };

  // Update handleAddAssociation to handle both add and edit
  const handleAddAssociation = async () => {
    try {
      const associationData = {
        ...newAssociation,
        project_id: currentProject.id,
      };

      // If association has an ID, update existing association
      if (newAssociation.id) {
        const updatedAssociations = associations.map((a) =>
          a.id === newAssociation.id ? { ...associationData } : a
        );
        setAssociations(updatedAssociations);
      } else {
        // Add new association
        const newAssociationWithId = {
          ...associationData,
          id: Date.now(), // Temporary ID for new associations
        };
        setAssociations([...associations, newAssociationWithId]);
      }

      // Reset form
      setNewAssociation({ name: "", img: "" });
      toast.success(
        newAssociation.id
          ? "Association updated successfully"
          : "Association added successfully"
      );
    } catch (error) {
      toast.error("Error managing association: " + error.message);
    }
  };

  // Update the handleDeleteAssociation function
  const handleDeleteAssociation = async (associationId) => {
    try {
      await projectAssociationsApi.delete(associationId);
      const updatedAssociations = associations.filter(
        (assoc) => assoc.id !== associationId
      );
      setAssociations(updatedAssociations);
      toast.success("Association deleted successfully");
    } catch (error) {
      toast.error("Error deleting association: " + error.message);
    }
  };

  // Add new functions for category management
  // Replace the handleAddCategory function
  const handleAddCategory = async () => {
    try {
      if (!newCategory.trim()) {
        toast.error("Please enter a category name");
        return;
      }

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("projects")
          .update({ category: newCategory.trim() })
          .eq("category", editingCategory);

        if (error) throw error;

        setCategories(
          categories.map((cat) =>
            cat === editingCategory ? newCategory.trim() : cat
          )
        );
        toast.success("Category updated successfully");
      } else {
        // Add new category
        const { error } = await supabase
          .from("projects")
          .insert([{ category: newCategory.trim() }]);

        if (error) throw error;

        setCategories([...categories, newCategory.trim()]);
        toast.success("Category added successfully");
      }

      setNewCategory("");
      setEditingCategory(null);
      setOpenCategoryDialog(false);
    } catch (error) {
      toast.error("Error managing category: " + error.message);
    }
  };

  // Replace the handleDeleteCategory function
  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ category: null })
        .eq("category", categoryToDelete);

      if (error) throw error;

      // Remove category from the list
      const updatedCategories = categories.filter(
        (cat) => cat !== categoryToDelete
      );
      setCategories(updatedCategories);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category: " + error.message);
    }
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting project...");
    try {
      // Delete all related records using the APIs
      await projectMembersApi.deleteByProjectId(itemToDelete.id);
      await projectAssociationsApi.deleteByProjectId(itemToDelete.id);
      await projectsApi.delete(itemToDelete.id);

      await fetchProjects();
      toast.dismiss(loadingToast);
      toast.success("Project deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      enableBodyScroll();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error deleting project:", error);
      toast.error("Error deleting project: " + error.message);
    }
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    enableBodyScroll();
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "0 auto",
        p: 3,
        "& .MuiPaper-root": {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Toaster
        position="top-center"
        toastOptions={toastConfig}
        containerStyle={{
          top: 20,
        }}
        gutter={8}
      />
      {/* Main Projects List */}
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
                Projects
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage your projects and collaborations
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
              Add Project
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} key={project.id}>
                <Card sx={styles.projectCard}>
                  <Grid container spacing={3}>
                    {/* Image section */}
                    <Grid item xs={12} sm={4}>
                      <Box sx={styles.imageContainer}>
                        {project.image ? (
                          <Box
                            component="img"
                            src={project.image}
                            alt={project.title}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CodeIcon sx={{ fontSize: 40, color: "#94A3B8" }} />
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Content section */}
                    <Grid item xs={12} sm={8}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#1E293B",
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            {project.title}
                          </Typography>
                          <Chip
                            label={project.category}
                            size="small"
                            sx={styles.chip}
                          />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {project.github && (
                            <IconButton
                              href={project.github}
                              target="_blank"
                              sx={styles.iconButton}
                            >
                              <GitHubIcon />
                            </IconButton>
                          )}
                          {project.dashboard && (
                            <IconButton
                              href={project.dashboard}
                              target="_blank"
                              sx={{
                                ...styles.iconButton,
                                color: "#1E293B", // Changed from #0284c7 to black
                                "&:hover": {
                                  backgroundColor: "#F1F5F9",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              <DashboardIcon />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleEdit(project)}
                            sx={{
                              ...styles.iconButton,
                              color: "#1E293B", // Changed from #0f766e to black
                              "&:hover": {
                                backgroundColor: "#F1F5F9",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(project)}
                            sx={{
                              ...styles.iconButton,
                              color: "#dc2626", // Kept delete button red
                              "&:hover": {
                                backgroundColor: "#fee2e2",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Project descriptions */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#475569",
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        {project.description}
                      </Typography>

                      {/* Tags */}
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ gap: 1, mt: 2 }}
                      >
                        {project.tags.map((tag, index) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: `hsl(${
                                (index * 75) % 360
                              }, 85%, 97%)`,
                              color: `hsl(${(index * 75) % 360}, 85%, 35%)`,
                              border: "1px solid",
                              borderColor: `hsl(${
                                (index * 75) % 360
                              }, 85%, 90%)`,
                              fontWeight: 500,
                              "&:hover": {
                                backgroundColor: `hsl(${
                                  (index * 75) % 360
                                }, 85%, 95%)`,
                                borderColor: `hsl(${
                                  (index * 75) % 360
                                }, 85%, 85%)`,
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Project Dialog */}
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
              {editMode ? "Edit Project" : "Add Project"}
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
            {/* Project Details */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Project Title"
                value={currentProject.title || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    title: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={currentProject.category || ""}
                  label="Category"
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      category: e.target.value,
                    })
                  }
                  sx={styles.dialogField}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                required
                label="Description"
                value={currentProject.description || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    description: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 2"
                value={currentProject.description2 || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    description2: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 3"
                value={currentProject.description3 || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    description3: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    const newTag = tagInput.trim();
                    if (!currentProject.tags.includes(newTag)) {
                      setCurrentProject((prev) => ({
                        ...prev,
                        tags: [...prev.tags, newTag],
                      }));
                      setTagInput("");
                      toast.success(`Added tag: ${newTag}`, {
                        icon: "🏷️",
                        duration: 2000,
                      });
                    } else {
                      toast.error("This tag already exists", {
                        icon: "⚠️",
                        duration: 3000,
                      });
                    }
                  }
                }}
                placeholder="Type a tag and press Enter"
                helperText="Press Enter to add a tag"
                sx={styles.dialogField}
              />
              <AnimatePresence>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  sx={chipStyles}
                  component={motion.div}
                  layout
                >
                  {currentProject.tags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      <Chip
                        label={tag}
                        onDelete={() => {
                          setCurrentProject((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((t) => t !== tag),
                          }));
                          toast.success(`Removed tag: ${tag}`, {
                            icon: "🗑️",
                            duration: 2000,
                          });
                        }}
                        sx={{
                          maxWidth: "180px",
                          backgroundColor: `hsl(${
                            (index * 75) % 360
                          }, 85%, 97%)`,
                          borderColor: `hsl(${(index * 75) % 360}, 85%, 90%)`,
                          color: `hsl(${(index * 75) % 360}, 85%, 35%)`,
                          border: "1px solid",
                          "&:hover": {
                            backgroundColor: `hsl(${
                              (index * 75) % 360
                            }, 85%, 95%)`,
                            borderColor: `hsl(${(index * 75) % 360}, 85%, 85%)`,
                          },
                          "& .MuiChip-label": {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 600,
                          },
                          "& .MuiChip-deleteIcon": {
                            color: `hsl(${(index * 75) % 360}, 85%, 35%)`,
                            "&:hover": {
                              color: `hsl(${(index * 75) % 360}, 85%, 25%)`,
                            },
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </AnimatePresence>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={currentProject.github || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    github: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dashboard URL"
                value={currentProject.dashboard || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    dashboard: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={currentProject.image || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    image: e.target.value,
                  })
                }
                sx={styles.dialogField}
                helperText="Enter the URL of the project image"
              />
              {currentProject.image && (
                <Box
                  sx={{
                    mt: 2,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "grey.200",
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src={currentProject.image}
                    alt="Project preview"
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() =>
                      setCurrentProject({ ...currentProject, image: "" })
                    }
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: "#1E293B", mb: 2 }}>
                  Project Category
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={currentProject.category || ""}
                      label="Category"
                      onChange={(e) =>
                        setCurrentProject({
                          ...currentProject,
                          category: e.target.value,
                        })
                      }
                      sx={styles.dialogField}
                    >
                      {categories.map((category) => (
                        <MenuItem
                          key={category}
                          value={category}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 2,
                            py: 1.5,
                          }}
                        >
                          {category}
                        </MenuItem>
                      ))}
                      <MenuItem value="" sx={{ color: "#64748B" }}>
                        <em>None</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Categories Management Section */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#475569", mb: 1 }}
                >
                  Manage Categories
                </Typography>
                <Stack spacing={1}>
                  {categories.map((category) => (
                    <Card
                      key={category}
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography>{category}</Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditCategory(category)}
                          sx={{
                            color: "#1E293B",
                            "&:hover": {
                              backgroundColor: "rgba(30, 41, 59, 0.04)",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCategory(category)}
                          sx={{
                            color: "#EF4444",
                            "&:hover": {
                              backgroundColor: "rgba(239, 68, 68, 0.04)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setNewCategory("");
                      setEditingCategory(null);
                      setOpenCategoryDialog(true);
                    }}
                    sx={{
                      color: "#1E293B",
                      borderColor: "#E2E8F0",
                      "&:hover": {
                        borderColor: "#CBD5E1",
                        backgroundColor: "#F8FAFC",
                      },
                      textTransform: "none",
                    }}
                  >
                    Add New Category
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Add Category Dialog */}
            <Dialog
              open={openCategoryDialog}
              onClose={() => {
                setOpenCategoryDialog(false);
                setNewCategory("");
                setEditingCategory(null);
              }}
              PaperProps={{
                sx: {
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: 2,
                },
              }}
            >
              <DialogTitle
                sx={{
                  backgroundColor: "#F8FAFC",
                  borderBottom: "1px solid",
                  borderColor: "grey.200",
                  p: 3,
                }}
              >
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Category Name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  sx={{ mt: 1 }}
                />
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                  onClick={() => {
                    setOpenCategoryDialog(false);
                    setNewCategory("");
                    setEditingCategory(null);
                  }}
                  sx={{ color: "#64748B" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  variant="contained"
                  sx={commonButtonSx}
                >
                  {editingCategory ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid container spacing={3}>
            {/* ...existing form fields... */}

            {/* Members Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#1E293B", mb: 2, mt: 2 }}>
                Project Members
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Member Name"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                      sx={styles.dialogField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Member Image URL"
                      value={newMember.img}
                      onChange={(e) =>
                        setNewMember({ ...newMember, img: e.target.value })
                      }
                      sx={styles.dialogField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GitHub Profile"
                      value={newMember.github}
                      onChange={(e) =>
                        setNewMember({ ...newMember, github: e.target.value })
                      }
                      sx={styles.dialogField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="LinkedIn Profile"
                      value={newMember.linkedin}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          linkedin: e.target.value,
                        })
                      }
                      sx={styles.dialogField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={handleAddMember}
                      sx={commonButtonSx}
                    >
                      Add Member
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Members List */}
              <Stack spacing={2}>
                {members.map((member) => (
                  <Card key={member.id} sx={styles.memberCard}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={member.img}
                          alt={member.name}
                          sx={styles.avatar}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {member.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {member.github && (
                              <IconButton
                                size="small"
                                href={member.github}
                                target="_blank"
                              >
                                <GitHubIcon fontSize="small" />
                              </IconButton>
                            )}
                            {member.linkedin && (
                              <IconButton
                                size="small"
                                href={member.linkedin}
                                target="_blank"
                              >
                                <LinkedInIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditMember(member)}
                          sx={styles.iconButton} // Changed from color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteMember(member.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Grid>

            {/* Associations Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#1E293B", mb: 2, mt: 2 }}>
                Project Associations
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Association Name"
                      value={newAssociation.name}
                      onChange={(e) =>
                        setNewAssociation({
                          ...newAssociation,
                          name: e.target.value,
                        })
                      }
                      sx={styles.dialogField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Association Logo URL"
                      value={newAssociation.img}
                      onChange={(e) =>
                        setNewAssociation({
                          ...newAssociation,
                          img: e.target.value,
                        })
                      }
                      sx={styles.dialogField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<BusinessIcon />}
                      onClick={handleAddAssociation}
                      sx={commonButtonSx}
                    >
                      Add Association
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Associations List */}
              <Stack spacing={2}>
                {associations.map((association) => (
                  <Card key={association.id} sx={styles.memberCard}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={association.img}
                          alt={association.name}
                          sx={styles.avatar}
                        />
                        <Typography variant="subtitle1">
                          {association.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditAssociation(association)}
                          sx={styles.iconButton} // Changed from color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteAssociation(association.id)
                          }
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Stack>
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
            {editMode ? "Save Changes" : "Add Project"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <StyledDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
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
                Delete Project
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
                {/* Project Preview */}
                <Box sx={{ display: "flex", gap: 2.5 }}>
                  <Box
                    sx={{
                      width: 120,
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
                    {itemToDelete.image ? (
                      <Box
                        component="img"
                        src={itemToDelete.image}
                        alt={itemToDelete.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <CodeIcon sx={{ fontSize: 40, color: "#94A3B8" }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1E293B", mb: 0.5 }}
                    >
                      {itemToDelete.title}
                    </Typography>
                    <Chip
                      label={itemToDelete.category}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(241, 245, 249, 0.8)",
                        color: "#475569",
                        fontSize: "0.75rem",
                        height: "24px",
                      }}
                    />
                  </Box>
                </Box>

                {/* Project Details */}
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px dashed rgba(203, 213, 225, 0.5)",
                  }}
                >
                  {/* Tags */}
                  {itemToDelete.tags && itemToDelete.tags.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#94A3B8", display: "block", mb: 1 }}
                      >
                        Technologies & Tools
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ gap: 1 }}
                      >
                        {itemToDelete.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(241, 245, 249, 0.8)",
                              color: "#475569",
                              fontSize: "0.75rem",
                              height: "24px",
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{ color: "#1E293B", mb: 2, fontWeight: 500 }}
              >
                Are you sure you want to delete this project?
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
                ⚠️ This action cannot be undone. The project and all associated
                data (members, associations, etc.) will be permanently removed.
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
            Delete Project
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default ProjectForm;
