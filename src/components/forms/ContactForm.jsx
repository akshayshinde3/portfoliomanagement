import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  Sync as LoadingIcon,
} from "@mui/icons-material";
import { contactsApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useScrollLock } from "../../hooks/useScrollLock";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    p: { xs: 2, sm: 3 },
    width: "100%",
  },

  paper: {
    borderRadius: { xs: 2, sm: 4 },
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  gradientHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: { xs: 2.5, sm: 4 },
  },

  headerText: {
    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },

  addButton: {
    display: { xs: "none", sm: "flex" },
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    fontWeight: 600,
    px: { xs: 2, sm: 3 },
    py: { xs: 1, sm: 1.5 },
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

  // Mobile-specific fab button
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

  tableContainer: {
    overflowX: "auto",
    "& .MuiTable-root": {
      minWidth: { xs: "100%", sm: 800 },
    },
  },

  tableHeader: {
    display: { xs: "none", sm: "table-row" },
    background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
    "& .MuiTableCell-head": {
      color: "#1E293B",
      fontWeight: 600,
      fontSize: { xs: "0.813rem", sm: "0.875rem" },
      whiteSpace: "nowrap",
    },
  },

  // Mobile card style for table rows
  mobileCard: {
    display: { xs: "block", sm: "none" },
    p: 2,
    mb: 2,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "grey.200",
    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  },

  messageCell: {
    maxWidth: { xs: "200px", sm: "300px" },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1.5,
    borderRadius: 2,
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
};

// Add mobile-optimized dialog styles
const dialogStyles = {
  paper: {
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 600 },
    m: { xs: 2, sm: 4 },
    borderRadius: { xs: 2, sm: 3 },
  },
  content: {
    p: { xs: 2, sm: 3 },
    "& .MuiTextField-root": {
      mb: { xs: 2, sm: 2.5 },
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
    style: {
      background: "rgba(16, 185, 129, 0.95)",
    },
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
    style: {
      background: "rgba(239, 68, 68, 0.95)",
    },
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
    style: {
      background: "rgba(30, 41, 59, 0.95)",
    },
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

const ContactForm = () => {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { enableBodyScroll, disableBodyScroll } = useScrollLock();

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>Loading contacts...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      const data = await contactsApi.fetch();
      setContacts(data || []);
      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Contacts loaded successfully</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Failed to load contacts: {error.message}</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!currentContact.name || !currentContact.email) {
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Name and email are required</Typography>
        </Box>,
        { ...toastConfig }
      );
      return;
    }

    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>{editMode ? "Updating" : "Adding"} contact...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      if (editMode) {
        await contactsApi.update(currentContact);
      } else {
        await contactsApi.create(currentContact);
      }

      await fetchContacts();
      setOpen(false);
      resetForm();
      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>
            Contact {editMode ? "updated" : "added"} successfully!
          </Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    } catch (error) {
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Error saving contact: {error.message}</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    }
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
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

  const handleDeleteConfirm = async () => {
    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>Deleting contact...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      await contactsApi.delete(itemToDelete.id);
      await fetchContacts();
      setDeleteDialogOpen(false);
      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Contact deleted successfully!</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    } catch (error) {
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Error deleting contact: {error.message}</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    }
  };

  const resetForm = () => {
    setCurrentContact({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setEditMode(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={styles.container}>
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
                Contact Management
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage incoming contact messages
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
              sx={styles.addButton}
            >
              Add Contact
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Desktop Table */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <TableContainer sx={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow sx={styles.tableHeader}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contact) => (
                      <TableRow key={contact.id} sx={styles.tableRow}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <EmailIcon
                              sx={{ fontSize: 18, color: "#64748B" }}
                            />
                            {contact.email}
                          </Box>
                        </TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell sx={styles.messageCell}>
                          {contact.message}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <AccessTimeIcon
                                sx={{ fontSize: 16, color: "#64748B" }}
                              />
                              {formatDateTime(contact.created_at).date}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDateTime(contact.created_at).time}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleEdit(contact)}
                            sx={{
                              color: "#64748B",
                              "&:hover": { color: "#1E293B" },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(contact)}
                            sx={{
                              color: "#EF4444",
                              "&:hover": { color: "#DC2626" },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            {contacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => (
                <Paper key={contact.id} sx={styles.mobileCard}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {contact.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 16 }} />
                      {contact.email}
                    </Typography>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {contact.subject}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {contact.message}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(contact.created_at).date}
                      <br />
                      {formatDateTime(contact.created_at).time}
                    </Typography>

                    <Box>
                      <IconButton
                        onClick={() => handleEdit(contact)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(contact)}
                        size="small"
                        sx={{ color: "#EF4444" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
          </Box>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>

      {/* Contact Form Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: dialogStyles.paper,
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
              {editMode ? "Edit Contact" : "Add Contact"}
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
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
        <DialogContent sx={dialogStyles.content}>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={currentContact.name}
              onChange={(e) =>
                setCurrentContact({ ...currentContact, name: e.target.value })
              }
              sx={styles.dialogField}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={currentContact.email}
              onChange={(e) =>
                setCurrentContact({ ...currentContact, email: e.target.value })
              }
              sx={styles.dialogField}
            />
            <TextField
              fullWidth
              label="Subject"
              value={currentContact.subject}
              onChange={(e) =>
                setCurrentContact({
                  ...currentContact,
                  subject: e.target.value,
                })
              }
              sx={styles.dialogField}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={currentContact.message}
              onChange={(e) =>
                setCurrentContact({
                  ...currentContact,
                  message: e.target.value,
                })
              }
              sx={styles.dialogField}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={() => setOpen(false)}
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
            {editMode ? "Save Changes" : "Add Contact"}
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
                Delete Contact
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
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 24, color: "#94A3B8" }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1E293B", mb: 0.5 }}
                    >
                      {itemToDelete.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      {itemToDelete.email}
                    </Typography>
                  </Box>
                </Box>

                {itemToDelete.subject && (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#475569", mb: 0.5 }}
                    >
                      Subject
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1E293B" }}>
                      {itemToDelete.subject}
                    </Typography>
                  </Box>
                )}

                {itemToDelete.message && (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#475569", mb: 0.5 }}
                    >
                      Message
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1E293B" }}>
                      {itemToDelete.message}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    mt: 1,
                    pt: 2,
                    borderTop: "1px dashed rgba(203, 213, 225, 0.5)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748B",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    Received on {
                      formatDateTime(itemToDelete.created_at).date
                    }{" "}
                    at {formatDateTime(itemToDelete.created_at).time}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{ color: "#1E293B", mb: 2, fontWeight: 500 }}
              >
                Are you sure you want to delete this contact?
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
                ⚠️ This action cannot be undone. The contact and all associated
                information will be permanently removed.
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
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={styles.deleteButton}
          >
            Delete Contact
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

      {/* Mobile-specific FAB button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        sx={styles.fabButton}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ContactForm;
