import React, { useState, useEffect } from 'react'
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
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { supabase } from '../../config/supabase'

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([])
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentExperience, setCurrentExperience] = useState({
    img: '',
    role: '',
    company: '',
    date: '',
    description: '',
    description2: '',
    description3: '',
    skills: [],
    doc: '',
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')

      if (error) throw error
      console.log('Fetched experience data:', data)
      setExperiences(data || [])
    } catch (error) {
      console.error('Error details:', error)
      toast.error('Error fetching experience data: ' + error.message)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!currentExperience.role || !currentExperience.company) {
        toast.error('Please fill in all required fields')
        return
      }

      const { error } = await supabase
        .from('experiences')
        .upsert({
          ...currentExperience,
          id: editMode ? currentExperience.id : undefined
        })

      if (error) throw error

      await fetchExperiences()
      handleClose()
      toast.success(editMode ? 'Experience updated successfully' : 'Experience added successfully')
    } catch (error) {
      console.error('Error details:', error)
      toast.error('Error saving experience: ' + error.message)
    }
  }

  const handleEdit = (experience) => {
    setCurrentExperience(experience)
    setEditMode(true)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchExperiences()
      toast.success('Experience deleted successfully')
    } catch (error) {
      toast.error('Error deleting experience: ' + error.message)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setCurrentExperience({
      img: '',
      role: '',
      company: '',
      date: '',
      description: '',
      description2: '',
      description3: '',
      skills: [],
      doc: '',
    })
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          p: 4,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>
              Experience
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Manage your work experience
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditMode(false)
              setOpen(true)
            }}
            sx={{
              backgroundColor: '#0F172A',
              '&:hover': { backgroundColor: '#1E293B' },
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Add Experience
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {experiences.map((experience) => (
              <Grid item xs={12} key={experience.id}>
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}>
                  <Grid container spacing={3} alignItems="flex-start">
                    <Grid item xs={12} sm={2}>
                      <Box
                        sx={{
                          width: '100%',
                          minHeight: '100px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bgcolor: '#F8FAFC',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'grey.200',
                          p: 1,
                        }}
                      >
                        {experience.img ? (
                          <Box
                            component="img"
                            src={experience.img}
                            alt={experience.company}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block',
                              borderRadius: '50%',
                            }}
                            onError={(e) => {
                              console.log('Image load error for:', experience.company)
                              e.target.onerror = null
                              e.target.src = 'https://via.placeholder.com/100?text=No+Image'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: '#E2E8F0',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <WorkIcon sx={{ fontSize: 30, color: '#94A3B8' }} />
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6" sx={{ color: '#1E293B', mb: 1 }}>
                        {experience.role}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#475569', mb: 0.5 }}>
                        {experience.company}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                        {experience.date}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                        {experience.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                        {experience.description2}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                        {experience.description3}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {experience.skills.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small"
                            sx={{ 
                              backgroundColor: '#F1F5F9',
                              color: '#475569',
                            }}
                          />
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEdit(experience)}
                          sx={{ 
                            color: '#0F172A',
                            '&:hover': { backgroundColor: '#F1F5F9' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(experience.id)}
                          sx={{ 
                            color: '#EF4444',
                            '&:hover': { backgroundColor: '#FEE2E2' }
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1E293B', fontWeight: 600 }}>
              {editMode ? 'Edit Experience' : 'Add Experience'}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Logo URL"
                value={currentExperience.img || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, img: e.target.value })}
              />
              {currentExperience.img && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <img
                    src={currentExperience.img}
                    alt="Company Logo"
                    style={{ 
                      maxHeight: 200, 
                      maxWidth: '100%', 
                      objectFit: 'contain',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Role"
                value={currentExperience.role || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, role: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Company"
                value={currentExperience.company || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Date"
                value={currentExperience.date || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, date: e.target.value })}
                helperText="e.g., October 2022 - October 2023"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={currentExperience.description || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 2"
                value={currentExperience.description2 || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, description2: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 3"
                value={currentExperience.description3 || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, description3: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma-separated)"
                value={Array.isArray(currentExperience.skills) ? currentExperience.skills.join(', ') : ''}
                onChange={(e) => setCurrentExperience({ 
                  ...currentExperience, 
                  skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                })}
                helperText="Enter skills separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certificate URL"
                value={currentExperience.doc || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, doc: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: '#64748B',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#F1F5F9' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#0F172A',
              '&:hover': { backgroundColor: '#1E293B' },
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            {editMode ? 'Save Changes' : 'Add Experience'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ExperienceForm 