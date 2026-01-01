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

const LoginForm = ({ formData, handleChange, handleSubmit }) => {
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
                Welcome Back!
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
                Enter the following details to login
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
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
                        sx={{
                            "& .MuiOutlinedInput-root": { height: "48px" },
                            width: '386px',
                        }}
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
                        sx={{
                            "& .MuiOutlinedInput-root": { height: "48px" }, width: '386px',
                        }}
                    />
                </Box>

                {/* Forgot Password Row */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 1,
                        mb: 2, // optional spacing
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "Raleway",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "20px",
                            textDecoration: "none",
                            color: "rgba(109, 109, 109, 1)",
                        }}
                    >
                        Remember Password
                    </Typography>
                    {/* Right: Forgot Password Link */}
                    <Box>
                        <a
                            href="#"
                            style={{
                                fontFamily: "Raleway",
                                fontWeight: 500,
                                fontSize: "14px",
                                lineHeight: "20px",
                                textDecoration: "none",
                                color: "rgba(26, 26, 26, 1)",
                            }}
                        >
                            Forgot Password?
                        </a>
                    </Box>
                </Box>


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
                    Don't have an account?{' '}
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
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;
