import React, { useState } from 'react'
import { Button, Box, CircularProgress } from '@mui/material'
import { supabase } from '../../config/supabase'

const ImageUpload = ({ onUploadComplete, folder }) => {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (event) => {
    try {
      setUploading(true)
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <Button
        variant="contained"
        component="label"
        disabled={uploading}
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload Image'}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={uploadImage}
        />
      </Button>
    </Box>
  )
}

export default ImageUpload 