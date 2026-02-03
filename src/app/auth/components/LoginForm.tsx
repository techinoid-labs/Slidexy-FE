'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Link,
} from '@mui/material';

// Props interface
export interface FormProps {
  formData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  switchForm: React.Dispatch<React.SetStateAction<'signup' | 'login' | 'forgot'>>;
}

const LoginForm: React.FC<FormProps> = ({ formData, handleChange, handleSubmit, switchForm }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box>
        <img
          src="/images/Logo.svg"
          alt="Slidexy Logo"
          style={{ width: 210, height: 64, marginBottom: 20 }}
        />
      </Box>

      <Typography
        gutterBottom
        sx={{
          fontFamily: 'Raleway',
          fontWeight: 600,
          fontSize: 30,
          lineHeight: '38px',
          textAlign: 'center',
        }}
      >
        Welcome Back!
      </Typography>

      <Typography
        gutterBottom
        sx={{
          fontFamily: 'Raleway',
          fontWeight: 500,
          fontSize: 16,
          lineHeight: '24px',
          textAlign: 'center',
          mb: 2,
        }}
      >
        Enter the following details to login
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {/* Email */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            component="label"
            htmlFor="email"
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgba(69,69,69,1)',
              mb: 0.5,
              display: 'block',
            }}
          >
            Email
          </Typography>
          <TextField
            id="email"
            fullWidth
            name="email"
            type="email"
            placeholder="Enter email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    component="img"
                    src="/images/auth/message-icon.svg"
                    alt="email"
                    sx={{ width: 20, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { height: 48 } }}
          />
        </Box>

        {/* Password */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            component="label"
            htmlFor="password"
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgba(69,69,69,1)',
              mb: 0.5,
              display: 'block',
            }}
          >
            Password
          </Typography>
          <TextField
            id="password"
            fullWidth
            name="password"
            type="password"
            placeholder="Enter password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    component="img"
                    src="/images/auth/password-icon.svg"
                    alt="password"
                    sx={{ width: 20, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { height: 48 } }}
          />
        </Box>

        {/* Remember / Forgot Password */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgba(109,109,109,1)',
            }}
          >
            Remember Password
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgba(26,26,26,1)',
              cursor: 'pointer',
            }}
            onClick={() => switchForm('forgot')}
          >
            Forgot Password?
          </Typography>
        </Box>

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 1,
            mb: 2,
            backgroundColor: 'rgba(74, 0, 224, 1)',
            borderRadius: 2,
          }}
        >
          Login
        </Button>

        {/* Switch to Signup */}
        <Typography variant="body2" align="center">
          Don't have an account?{' '}
          <span
            onClick={() => switchForm('signup')}
            style={{ color: 'rgba(74,0,224,1)', cursor: 'pointer' }}
          >
            Sign up
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
