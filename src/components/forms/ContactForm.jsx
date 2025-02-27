import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  IconButton,
  Grid,
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { supabase } from "../../config/supabase";
import { contactsApi } from "../../api/SupabaseData";

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

  contactCard: {
    p: 3,
    border: "1px solid",
    borderColor: "grey.200",
    borderRadius: 3,
    transition: "all 0.3s ease",
    backgroundColor: "white",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
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

  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
    },
  },

  tableHeader: {
    background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
    "& .MuiTableCell-head": {
      color: "#1E293B",
      fontWeight: 600,
      fontSize: "0.875rem",
    },
  },

  tableRow: {
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  },

  messageCell: {
    maxWidth: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

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
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },
};

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

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      toast.error("Error fetching contacts: " + error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        const { error } = await supabase
          .from("contacts")
          .update(currentContact)
          .eq("id", currentContact.id);
        if (error) throw error;
        toast.success("Contact updated successfully!");
      } else {
        const { error } = await supabase
          .from("contacts")
          .insert([currentContact]);
        if (error) throw error;
        toast.success("Contact added successfully!");
      }

      setOpen(false);
      fetchContacts();
      resetForm();
    } catch (error) {
      toast.error("Error saving contact: " + error.message);
    }
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", itemToDelete.id);

      if (error) throw error;

      toast.success("Contact deleted successfully!");
      setDeleteDialogOpen(false);
      fetchContacts();
    } catch (error) {
      toast.error("Error deleting contact: " + error.message);
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
              Add Contact
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <TableContainer>
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EmailIcon sx={{ fontSize: 18, color: "#64748B" }} />
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
                          <Typography variant="caption" color="text.secondary">
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
                          onClick={() => {
                            setItemToDelete(contact);
                            setDeleteDialogOpen(true);
                          }}
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
        <DialogContent
          sx={{
            p: 3,
            pt: 4,
            "&.MuiDialogContent-root": {
              paddingTop: "24px !important",
            },
          }}
        >
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
              Delete Contact
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
          <Typography>Are you sure you want to delete this contact?</Typography>
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
            onClick={handleDelete}
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

export default ContactForm;
