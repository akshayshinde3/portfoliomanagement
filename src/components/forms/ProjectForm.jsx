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
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { supabase } from "../../config/supabase";

const ProjectForm = () => {
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

  useEffect(() => {
    fetchProjects();
  }, []);

  // Update the fetchProjects function
  const fetchProjects = async () => {
    try {
      // First fetch all projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*");

      if (projectsError) throw projectsError;

      // For each project, fetch its members and associations
      const projectsWithRelations = await Promise.all(
        projectsData.map(async (project) => {
          // Fetch members for this project
          const { data: members, error: membersError } = await supabase
            .from("members")
            .select("*")
            .eq("project_id", project.id);

          if (membersError) throw membersError;

          // Fetch associations for this project
          const { data: associations, error: associationsError } =
            await supabase
              .from("associations")
              .select("*")
              .eq("project_id", project.id);

          if (associationsError) throw associationsError;

          // Return project with its relations
          return {
            ...project,
            members: members || [],
            associations: associations || [],
          };
        })
      );

      console.log("Fetched projects with relations:", projectsWithRelations);
      setProjects(projectsWithRelations);
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error fetching projects: " + error.message);
    }
  };

  const fetchMembers = async (projectId) => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Error fetching members: " + error.message);
    }
  };

  const fetchAssociations = async (projectId) => {
    try {
      const { data, error } = await supabase
        .from("associations")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      setAssociations(data || []);
    } catch (error) {
      console.error("Error fetching associations:", error);
      toast.error("Error fetching associations: " + error.message);
    }
  };

  // Update the handleSubmit function to handle relations correctly
  const handleSubmit = async () => {
    try {
      if (!currentProject.title || !currentProject.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      // First save or update the project
      const projectToSave = {
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

      if (editMode) {
        projectToSave.id = currentProject.id;
      }

      // Save project
      const { data: savedProject, error: projectError } = await supabase
        .from("projects")
        .upsert(projectToSave)
        .select()
        .single();

      if (projectError) throw projectError;

      // Handle members
      if (editMode) {
        // Delete existing members
        await supabase
          .from("members")
          .delete()
          .eq("project_id", savedProject.id);
      }

      if (members.length > 0) {
        const membersToSave = members.map((member) => ({
          name: member.name,
          img: member.img,
          github: member.github,
          linkedin: member.linkedin,
          project_id: savedProject.id,
        }));

        const { error: membersError } = await supabase
          .from("members")
          .insert(membersToSave);

        if (membersError) throw membersError;
      }

      // Handle associations
      if (editMode) {
        // Delete existing associations
        await supabase
          .from("associations")
          .delete()
          .eq("project_id", savedProject.id);
      }

      if (associations.length > 0) {
        const associationsToSave = associations.map((association) => ({
          name: association.name,
          img: association.img,
          project_id: savedProject.id,
        }));

        const { error: associationsError } = await supabase
          .from("associations")
          .insert(associationsToSave);

        if (associationsError) throw associationsError;
      }

      await fetchProjects();
      handleClose();
      toast.success(
        editMode ? "Project updated successfully" : "Project added successfully"
      );
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving: " + error.message);
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

  const handleDelete = async (id) => {
    try {
      // First delete all related members
      const { error: membersError } = await supabase
        .from("members")
        .delete()
        .eq("project_id", id);

      if (membersError) throw membersError;

      // Then delete all related associations
      const { error: associationsError } = await supabase
        .from("associations")
        .delete()
        .eq("project_id", id);

      if (associationsError) throw associationsError;

      // Finally delete the project itself
      const { error: projectError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (projectError) throw projectError;

      await fetchProjects();
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Error deleting project: " + error.message);
    }
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

  const handleDeleteMember = async (memberId) => {
    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;
      await fetchMembers(currentProject.id);
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

  const handleDeleteAssociation = async (associationId) => {
    try {
      const { error } = await supabase
        .from("associations")
        .delete()
        .eq("id", associationId);

      if (error) throw error;
      await fetchAssociations(currentProject.id);
      toast.success("Association deleted successfully");
    } catch (error) {
      toast.error("Error deleting association: " + error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      {/* Main Projects List */}
      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F8FAFC",
            p: 4,
            borderBottom: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#1E293B", mb: 1 }}
            >
              Projects
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              Manage your projects
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
              backgroundColor: "#0F172A",
              "&:hover": { backgroundColor: "#1E293B" },
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Add Project
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} key={project.id}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          width: "100%",
                          height: "200px",
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "#F8FAFC",
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/400x200?text=No+Image";
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

                    <Grid item xs={12} sm={8}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ color: "#1E293B", mb: 1 }}
                          >
                            {project.title}
                          </Typography>
                          <Chip
                            label={project.category}
                            size="small"
                            sx={{
                              backgroundColor: "#F1F5F9",
                              color: "#475569",
                              mb: 2,
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {project.github && (
                            <IconButton
                              href={project.github}
                              target="_blank"
                              sx={{ color: "#1E293B" }}
                            >
                              <GitHubIcon />
                            </IconButton>
                          )}
                          {project.dashboard && (
                            <IconButton
                              href={project.dashboard}
                              target="_blank"
                              sx={{ color: "#1E293B" }}
                            >
                              <DashboardIcon />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleEdit(project)}
                            sx={{ color: "#1E293B" }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(project.id)}
                            sx={{ color: "#1E293B" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#475569", mb: 2 }}
                      >
                        {project.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#475569", mb: 2 }}
                      >
                        {project.description2}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#475569", mb: 2 }}
                      >
                        {project.description3}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {project.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: "#F1F5F9",
                              color: "#475569",
                            }}
                          />
                        ))}
                      </Stack>
                      <Box sx={{ mt: 2 }}>
                        {/* Members */}
                        {project.members && project.members.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "#475569", mb: 1 }}
                            >
                              Team Members ({project.members.length})
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              {project.members.map((member) => (
                                <Box
                                  key={member.id}
                                  sx={{
                                    position: "relative",
                                    "&:hover .member-details": {
                                      opacity: 1,
                                      visibility: "visible",
                                    },
                                  }}
                                >
                                  <Avatar
                                    src={member.img}
                                    alt={member.name}
                                    sx={{ width: 32, height: 32 }}
                                  />
                                  {/* Enhanced member details tooltip */}
                                  <Box
                                    className="member-details"
                                    sx={{
                                      position: "absolute",
                                      bottom: -80,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      backgroundColor: "#1E293B",
                                      color: "white",
                                      padding: "8px 12px",
                                      borderRadius: 1,
                                      opacity: 0,
                                      visibility: "hidden",
                                      transition: "all 0.2s ease",
                                      zIndex: 2,
                                      width: "max-content",
                                      boxShadow:
                                        "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        mb: 0.5,
                                      }}
                                    >
                                      {member.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                      {member.github && (
                                        <IconButton
                                          size="small"
                                          href={member.github}
                                          target="_blank"
                                          sx={{
                                            width: 20,
                                            height: 20,
                                            color: "white",
                                            "&:hover": {
                                              bgcolor: "rgba(255,255,255,0.1)",
                                            },
                                          }}
                                        >
                                          <GitHubIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                      )}
                                      {member.linkedin && (
                                        <IconButton
                                          size="small"
                                          href={member.linkedin}
                                          target="_blank"
                                          sx={{
                                            width: 20,
                                            height: 20,
                                            color: "white",
                                            "&:hover": {
                                              bgcolor: "rgba(255,255,255,0.1)",
                                            },
                                          }}
                                        >
                                          <LinkedInIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                      )}
                                    </Stack>
                                  </Box>
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      bottom: -4,
                                      right: -4,
                                      display: "flex",
                                      gap: 0.5,
                                    }}
                                  >
                                    {member.github && (
                                      <IconButton
                                        size="small"
                                        href={member.github}
                                        target="_blank"
                                        sx={{
                                          width: 16,
                                          height: 16,
                                          bgcolor: "#1E293B",
                                          color: "white",
                                          "&:hover": { bgcolor: "#334155" },
                                        }}
                                      >
                                        <GitHubIcon sx={{ fontSize: 12 }} />
                                      </IconButton>
                                    )}
                                    {member.linkedin && (
                                      <IconButton
                                        size="small"
                                        href={member.linkedin}
                                        target="_blank"
                                        sx={{
                                          width: 16,
                                          height: 16,
                                          bgcolor: "#0077B5",
                                          color: "white",
                                          "&:hover": { bgcolor: "#0066a1" },
                                        }}
                                      >
                                        <LinkedInIcon sx={{ fontSize: 12 }} />
                                      </IconButton>
                                    )}
                                  </Box>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {/* Associations */}
                        {project.associations &&
                          project.associations.length > 0 && (
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "#475569", mb: 1 }}
                              >
                                Associated With
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                {project.associations.map((association) => (
                                  <Chip
                                    key={association.id}
                                    avatar={
                                      <Avatar
                                        src={association.img}
                                        alt={association.name}
                                      />
                                    }
                                    label={association.name}
                                    variant="outlined"
                                    sx={{
                                      borderColor: "#E2E8F0",
                                      "& .MuiChip-avatar": {
                                        width: 24,
                                        height: 24,
                                      },
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Project Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid",
            borderColor: "grey.200",
            p: 3,
          }}
        >
          {editMode ? "Edit Project" : "Add New Project"}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#64748B",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
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
              />
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={
                  Array.isArray(currentProject.tags)
                    ? currentProject.tags.join(", ")
                    : ""
                }
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
                helperText="Enter tags separated by commas"
              />
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
              />
            </Grid>
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="LinkedIn Profile"
                      value={newMember.linkedin}
                      onChange={(e) =>
                        setNewMember({ ...newMember, linkedin: e.target.value })
                      }
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
                  <Card key={member.id} sx={{ p: 2 }}>
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
                        <Avatar src={member.img} alt={member.name} />
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
                          sx={{ color: "#1E293B" }} // Changed from color="primary"
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
                  <Card key={association.id} sx={{ p: 2 }}>
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
                        <Avatar src={association.img} alt={association.name} />
                        <Typography variant="subtitle1">
                          {association.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditAssociation(association)}
                          sx={{ color: "#1E293B" }} // Changed from color="primary"
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

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "#64748B",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={commonButtonSx}
          >
            {editMode ? "Save Changes" : "Add Project"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectForm;
