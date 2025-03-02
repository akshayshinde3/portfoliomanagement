import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
} from '@mui/material'
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl] = useState('https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/sign/Portfolio/profile_sandesh.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQb3J0Zm9saW8vcHJvZmlsZV9zYW5kZXNoLmpwZyIsImlhdCI6MTczODY0ODg4MSwiZXhwIjozMTcwOTg2NDg4ODF9.uwmEeA_cM1yqhr_18BseS7ibcaN6KquLyCUeoBTEqM0') // Replace with your image URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              py: 3,
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <Avatar
              src={imageUrl}
              alt="Profile"
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: '4px solid white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
              imgProps={{
                onError: (e) => {
                  e.target.src = 'https://via.placeholder.com/120?text=Profile'
                }
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Portfolio CMS
            </Typography>
            <Typography variant="subtitle1">
              Sign in to manage your portfolio content
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                required
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{ mt: 3, mb: 2, py: 1.2 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login 