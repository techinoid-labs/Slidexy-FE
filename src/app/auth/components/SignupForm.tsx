'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material';
import NextLink from 'next/link';

// Props interface
export interface FormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  switchForm: React.Dispatch<React.SetStateAction<'signup' | 'login' | 'forgot'>>;
}

const SignupForm: React.FC<FormProps> = ({ formData, handleChange, handleSubmit, switchForm }) => {
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
        <NextLink href="/">
          <img
            src="/images/Logo.svg"
            alt="Slidexy Logo"
            style={{ width: 210, height: 64, marginBottom: 20, cursor: 'pointer' }}
          />
        </NextLink>
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
        SignUp
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
        Enter the following details to SignUp
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {/* Full Name */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgba(69,69,69,1)',
              mb: 0.5,
            }}
          >
            Full Name
          </Typography>
          <TextField
            fullWidth
            name="fullName"
            placeholder="Enter full name"
            variant="outlined"
            value={formData.fullName}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    component="img"
                    src="/images/auth/name-icon.svg"
                    alt="user"
                    sx={{ width: 20, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { height: 48 } }}
          />
        </Box>

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

        {/* Confirm Password */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            component="label"
            htmlFor="confirmPassword"
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
            Confirm Password
          </Typography>
          <TextField
            id="confirmPassword"
            fullWidth
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    component="img"
                    src="/images/auth/password-icon.svg"
                    alt="confirm password"
                    sx={{ width: 20, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { height: 48 } }}
          />
        </Box>

        {/* Terms */}
        <FormControlLabel
          control={
            <Checkbox
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
          }
          label="I agree to the Terms of Service and Privacy Policy"
          sx={{
            fontFamily: 'Raleway',
            fontWeight: 500,
            fontSize: 12,
            lineHeight: '18px',
            mt: 1,
          }}
        />

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: 'rgba(74, 0, 224, 1)',
            borderRadius: 2,
          }}
        >
          Signup
        </Button>

        {/* Switch to Login */}
        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <span
            onClick={() => switchForm('login')}
            style={{ color: 'rgba(74,0,224,1)', cursor: 'pointer' }}
          >
            Login
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupForm;
