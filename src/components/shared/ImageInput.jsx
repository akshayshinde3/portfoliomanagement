import React from 'react'
import {
  TextField,
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material'
import { Preview, Clear } from '@mui/icons-material'

const ImageInput = ({ value, onChange, label = "Image URL" }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <>
              {value && (
                <>
                  <Tooltip title="Preview">
                    <IconButton
                      onClick={() => window.open(value, '_blank')}
                      size="small"
                    >
                      <Preview />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear">
                    <IconButton
                      onClick={() => onChange('')}
                      size="small"
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </>
          ),
        }}
      />
      {value && (
        <Paper 
          sx={{ 
            mt: 1, 
            p: 1, 
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{ 
              maxWidth: '100%',
              maxHeight: '200px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image+URL'
            }}
          />
        </Paper>
      )}
    </Box>
  )
}

export default ImageInput 