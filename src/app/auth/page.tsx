'use client'

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    Button,
    FormControlLabel,
    Checkbox,
    Link
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Signup = ({ formData, handleSubmit }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: { xs: 'column', md: 'row' } // stack on mobile, side by side on desktop
            }}
        >
            {/* Left Panel - Form */}
            <Paper
                elevation={6}
                square
                sx={{
                    flex: 1, // half width on desktop
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        SignUp
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Enter the following details to SignUp
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            //   value={formData.fullName}
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment
                                    variant='outlined'
                                    position="end">
                                        <PersonIcon sx={{ color: 'currentColor' }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            //   value={formData.email}
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <EmailIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            //   value={formData.password}
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <LockIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            //   value={formData.confirmPassword}
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <LockIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox name="agree"
                                // checked={formData.agree} 
                                />
                            }
                            label="I agree to the Terms of Service and Privacy Policy"
                            sx={{ mt: 1 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#6C1CF5' }}
                        >
                            Signup
                        </Button>

                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <Link href="#" underline="hover">
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Right Panel - Logo/Image */}
            <Box
                sx={{
                    flex: 1, // half width on desktop
                    backgroundColor: '#F0EBFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box textAlign="center">
                    <img
                        src="/Images/Logo.svg"
                        alt="Slidexy Logo"
                        style={{ width: '500px', height: 'auto', marginBottom: 16 }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Signup;