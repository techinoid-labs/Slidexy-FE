'use client'

import React from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    FormControlLabel,
    Checkbox,
    Link
} from '@mui/material';

const SignupForm = ({ formData, handleChange, handleSubmit }) => {
    return (
        <Box sx={{ 
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}>
            <Box >
                <img
                    src="/Images/Logo.svg"
                    alt="Slidexy Logo"
                    style={{ width: '210.03257751464844px', height: '64px', marginBottom: 20 }}
                />
            </Box>
            <Typography
                gutterBottom
                sx={{
                    fontFamily: "Raleway",
                    fontWeight: 600,
                    fontSize: "30px",
                    lineHeight: "38px",
                    textAlign: "center",
                }}
            >
                SignUp
            </Typography>

            <Typography
                gutterBottom
                sx={{
                    fontFamily: "Raleway",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "center",
                    mb: 2,
                }}
            >
                Enter the following details to SignUp
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                {/* Full Name */}
                <Box sx={{ width: "100%", mb: 2 }}>
                    <Typography
                        sx={{
                            fontFamily: "Raleway",
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgba(69, 69, 69, 1)",
                            mb: "6px",
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
                        sx={{
                            "& .MuiOutlinedInput-root": { height: "48px" },
                        }}
                    />
                </Box>

                {/* Email */}
                <Box sx={{ width: "100%", mb: 2 }}>
                    <Typography
                        component="label"
                        htmlFor="email"
                        sx={{
                            fontFamily: "Raleway",
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgba(69, 69, 69, 1)",
                            mb: "6px",
                            display: "block",
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
                        sx={{ "& .MuiOutlinedInput-root": { height: "48px" } }}
                    />
                </Box>

                {/* Password */}
                <Box sx={{ width: "100%", mb: 2 }}>
                    <Typography
                        component="label"
                        htmlFor="password"
                        sx={{
                            fontFamily: "Raleway",
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgba(69, 69, 69, 1)",
                            mb: "6px",
                            display: "block",
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
                        sx={{ "& .MuiOutlinedInput-root": { height: "48px" } }}
                    />
                </Box>

                {/* Confirm Password */}
                <Box sx={{ width: "100%", mb: 2 }}>
                    <Typography
                        component="label"
                        htmlFor="confirmPassword"
                        sx={{
                            fontFamily: "Raleway",
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgba(69, 69, 69, 1)",
                            mb: "6px",
                            display: "block",
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
                        sx={{ "& .MuiOutlinedInput-root": { height: "48px" } }}
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
                        fontFamily: "Raleway",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "18px",
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
                        borderRadius: '8px',
                    }}
                >
                    Signup
                </Button>

                <Typography variant="body2" align="center">
                    Already have an account?{' '}
                    <Link
                        href="#"
                        underline="hover"
                        sx={{
                            color: 'rgba(74, 0, 224, 1)',
                            fontFamily: "Raleway",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "20px",
                        }}
                    >
                        Login
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default SignupForm;
