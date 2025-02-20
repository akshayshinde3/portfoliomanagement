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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { supabase } from '../../config/supabase'

const SkillForm = () => {
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentSkill, setCurrentSkill] = useState({
    name: '',
    image: '',
    category_id: '',
  })
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState({ title: '' })
  const [editingCategory, setEditingCategory] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchSkills()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('title')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Error fetching categories: ' + error.message)
    }
  }

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          id,
          name,
          image,
          category_id,
          skill_categories (
            id,
            title
          )
        `)
        .order('name')

      if (error) throw error
      
      const processedSkills = data?.map(skill => ({
        ...skill,
        categoryTitle: skill.skill_categories?.title
      })) || []
      
      setSkills(processedSkills)
    } catch (error) {
      console.error('Error fetching skills:', error)
      toast.error('Error fetching skills: ' + error.message)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!currentSkill.name || !currentSkill.category_id) {
        toast.error('Please fill in required fields (Name and Category)')
        return
      }

      const skillData = {
        name: currentSkill.name.trim(),
        category_id: currentSkill.category_id,
        image: currentSkill.image?.trim() || null,
        id: editMode ? currentSkill.id : undefined
      } 

      const { error } = await supabase
        .from('skills')
        .upsert(skillData)

      if (error) throw error

      await fetchSkills()
      handleClose()
      toast.success(editMode ? 'Skill updated successfully' : 'Skill added successfully')
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Error saving skill: ' + error.message)
    }
  }

  const handleEdit = (skill) => {
    setCurrentSkill(skill)
    setEditMode(true)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchSkills()
      toast.success('Skill deleted successfully')
    } catch (error) {
      toast.error('Error deleting skill: ' + error.message)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setCurrentSkill({
      name: '',
      image: '',
      category_id: '',
    })
  }

  // Update the handleCategorySubmit function
  const handleCategorySubmit = async () => {
    try {
      if (!currentCategory.title) {
        toast.error('Please enter a category title')
        return
      }

      const { error } = await supabase
        .from('skill_categories')
        .upsert({
          id: editingCategory ? currentCategory.id : undefined,
          title: currentCategory.title.trim()
        })

      if (error) throw error

      await fetchCategories()
      handleCategoryClose()
      toast.success(editingCategory ? 'Category updated successfully' : 'Category added successfully')
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Error saving category: ' + error.message)
    }
  }

  const handleEditCategory = (category) => {
    setCurrentCategory(category)
    setEditingCategory(true)
    setCategoryDialogOpen(true)
  }

  const handleDeleteCategory = async (id) => {
    try {
      const { data: skillsInCategory, error: checkError } = await supabase
        .from('skills')
        .select('id, name')
        .eq('category_id', id)

      if (checkError) throw checkError

      if (skillsInCategory?.length > 0) {
        toast.error(`Cannot delete category. ${skillsInCategory.length} skills are using this category.`)
        return
      }

      const { error: deleteError } = await supabase
        .from('skill_categories')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await fetchCategories()
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Error deleting category: ' + error.message)
    }
  }

  const handleCategoryClose = () => {
    setCategoryDialogOpen(false)
    setEditingCategory(false)
    setCurrentCategory({ title: '' })
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
              Skills
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Manage your skills and technologies
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
            Add Skill
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          {categories.map((category) => (
            <Box key={category.id} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#1E293B', mb: 2 }}>
                {category.title}
              </Typography>
              <Grid container spacing={2}>
                {skills
                  .filter(skill => skill.category_id === category.id)
                  .map((skill) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={skill.id}>
                      <Card sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'grey.200',
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#F8FAFC',
                          }}>
                            {skill.image && (
                              <img
                                src={skill.image}
                                alt={skill.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(skill)}
                              sx={{ color: '#1E293B' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(skill.id)}
                              sx={{ color: '#EF4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#1E293B' }}>
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

      <Paper sx={{ mt: 4, p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E293B' }}>
            Skill Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCategoryDialogOpen(true)}
            sx={{
              backgroundColor: '#0F172A',
              '&:hover': { backgroundColor: '#1E293B' },
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Add Category
          </Button>
        </Box>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid',
                borderColor: 'grey.200',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="subtitle1" sx={{ color: '#1E293B' }}>
                    {category.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCategory(category)}
                      sx={{ color: '#1E293B' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(category.id)}
                      sx={{ color: '#EF4444' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1E293B', fontWeight: 600 }}>
              {editMode ? 'Edit Skill' : 'Add Skill'}
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
                required
                label="Skill Name"
                value={currentSkill.name || ''}
                onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={currentSkill.category_id || ''}
                  label="Category"
                  onChange={(e) => setCurrentSkill({ ...currentSkill, category_id: e.target.value })}
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
                value={currentSkill.image || ''}
                onChange={(e) => setCurrentSkill({ ...currentSkill, image: e.target.value })}
              />
              {currentSkill.image && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#F8FAFC',
                  }}>
                    <img
                      src={currentSkill.image}
                      alt="Skill Icon Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: '#64748B',
              textTransform: 'none',
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
            }}
          >
            {editMode ? 'Save Changes' : 'Add Skill'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={categoryDialogOpen} onClose={handleCategoryClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1E293B', fontWeight: 600 }}>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </Typography>
            <IconButton onClick={handleCategoryClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            label="Category Title"
            value={currentCategory.title || ''}
            onChange={(e) => setCurrentCategory({ ...currentCategory, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCategoryClose}
            sx={{ 
              color: '#64748B',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCategorySubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#0F172A',
              '&:hover': { backgroundColor: '#1E293B' },
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            {editingCategory ? 'Save Changes' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SkillForm