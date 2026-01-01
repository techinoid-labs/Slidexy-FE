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
    token?: string;
    newPassword?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  switchForm: React.Dispatch<React.SetStateAction<'signup' | 'login' | 'forgot'>>;
}

const ResetPasswordForm: React.FC<FormProps> = ({ formData, handleChange, handleSubmit, switchForm }) => {
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
          src="/Images/auth/forgot-password-icon.svg"
          alt="Forgot Password"
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
        Reset password
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
        Enter the following details to reset password
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>

        {/* TOKEN */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            component="label"
            htmlFor="token"
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
            Token
          </Typography>
          <TextField
            id="token"
            fullWidth
            name="token"
            type="password"
            placeholder="Enter Token"
            variant="outlined"
            value={formData.token || ''}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    component="img"
                    src="/images/auth/password-icon.svg"
                    alt="token"
                    sx={{ width: 20, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { height: 48 } }}
          />
        </Box>

        {/* NEW PASSWORD */}
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
            New Password
          </Typography>
          <TextField
            id="password"
            fullWidth
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            variant="outlined"
            value={formData.newPassword}
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
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;
