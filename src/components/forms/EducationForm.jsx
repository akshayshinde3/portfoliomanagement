import React, { useState, useEffect } from 'react'
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
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { supabase } from '../../config/supabase'
import dayjs from 'dayjs'

const EducationForm = () => {
  const [educations, setEducations] = useState([])
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentEducation, setCurrentEducation] = useState({
    school: '',
    degree: '',
    date: '',
    grade: '',
    description: '',
    img: '',
  })

  const commonButtonSx = {
    backgroundColor: '#0F172A',
    '&:hover': { backgroundColor: '#1E293B' },
    borderRadius: 2,
    textTransform: 'none',
    px: 3,
    py: 1,
  }

  useEffect(() => {
    fetchEducations()
  }, [])

  useEffect(() => {
    console.log('Current education state:', currentEducation)
  }, [currentEducation])

  useEffect(() => {
    console.log('Educations array:', educations)
  }, [educations])

  useEffect(() => {
    console.log('Current educations:', educations)
  }, [educations])

  const fetchEducations = async () => {
    try {
      console.log('Fetching educations...')
      const { data, error } = await supabase
        .from('education')
        .select('*')
        
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Fetched education data:', data) // Debug log to see the actual data structure
      setEducations(data || [])
    } catch (error) {
      console.error('Error details:', error)
      toast.error('Error fetching education data: ' + error.message)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!currentEducation.school || !currentEducation.degree || !currentEducation.date) {
        toast.error('Please fill in all required fields')
        return
      }

      const educationData = {
        school: currentEducation.school,
        degree: currentEducation.degree,
        date: currentEducation.date,
        grade: currentEducation.grade || null,
        description: currentEducation.description || null,
        img: currentEducation.img || null,
      }

      if (editMode && currentEducation.id) {
        educationData.id = currentEducation.id
      }

      console.log('Submitting education data:', educationData)

      const { error } = await supabase
        .from('education')
        .upsert(educationData)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      await fetchEducations()
      handleClose()
      toast.success(editMode ? 'Education updated successfully' : 'Education added successfully')
    } catch (error) {
      console.error('Error details:', error)
      toast.error('Error saving education: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchEducations()
      toast.success('Education deleted successfully')
    } catch (error) {
      toast.error('Error deleting education')
    }
  }

  const handleEdit = (education) => {
    setCurrentEducation({
      ...education,
      date: dayjs(education.date).format('YYYY-MM-DD'),
    })
    setEditMode(true)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setCurrentEducation({
      school: '',
      degree: '',
      date: '',
      grade: '',
      description: '',
      img: '',
    })
  }



  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Paper 
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
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
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: '#1E293B',
                mb: 1
              }}
            >
              Education
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748B',
                fontWeight: 400
              }}
            >
              Add or edit your educational background
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditMode(false)
              setOpen(true)
            }}
            sx={commonButtonSx}
          >
            Add Education
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3} >
            {educations.map((education) => {
              console.log('Education entry:', education)
              return (
                <Grid item xs={12} key={education.id}>
                  <Card sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Box
                          sx={{
                            width: '100%',
                            minHeight: '100px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: '#F8FAFC',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'grey.200',
                            p: 1,
                          }}
                        >
                          {education.img ? (
                            <Box
                              component="img"
                              src={education.img}
                              alt={education.school}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                borderRadius: '50%',
                                p: 1,
                              }}
                              onError={(e) => {
                                console.log('Image load error for:', education.school)
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
                              <SchoolIcon sx={{ fontSize: 30, color: '#94A3B8' }} />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" sx={{ color: '#1E293B', mb: 1 }}>
                          {education.school}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#475569', mb: 0.5 }}>
                          {education.degree}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                          {education.date}
                          {education.grade && ` • Grade: ${education.grade}`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                          {education.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton
                            onClick={() => handleEdit(education)}
                            sx={{ 
                              color: '#0F172A',
                              '&:hover': { backgroundColor: '#F1F5F9' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(education.id)}
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
              )
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
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1E293B', fontWeight: 600 }}>
              {editMode ? 'Edit Education' : 'Add Education'}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Logo URL"
                value={currentEducation.img || ''}
                onChange={(e) => setCurrentEducation({ ...currentEducation, img: e.target.value })}
              />
              {currentEducation.img && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <img
                    src={currentEducation.img}
                    alt="School Logo"
                    style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="School Name"
                value={currentEducation.school || ''}
                onChange={(e) => setCurrentEducation({ ...currentEducation, school: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Degree"
                value={currentEducation.degree || ''}
                onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Date"
                value={currentEducation.date || ''}
                onChange={(e) => setCurrentEducation({ ...currentEducation, date: e.target.value })}
                helperText="e.g., Apr 2017 - Apr 2021"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Grade"
                value={currentEducation.grade || ''}
                onChange={(e) => setCurrentEducation({ ...currentEducation, grade: e.target.value })}
                helperText="e.g., 75.00%"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={currentEducation.description || ''}
                onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              color: '#64748B',
              '&:hover': { backgroundColor: '#F1F5F9' }
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
            {editMode ? 'Save Changes' : 'Add Education'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EducationForm