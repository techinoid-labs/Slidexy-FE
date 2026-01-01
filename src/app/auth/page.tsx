'use client'

import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const Auth = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Add signup logic here
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: { xs: 'column', md: 'row' },
            }}
        >
            {/* Left Panel */}
            <Paper
                elevation={6}
                square
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                }}
            >
                {/* <SignupForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                /> */}
                {/* <LoginForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                /> */}
                    <ForgotPasswordForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            </Paper>

            {/* Right Panel */}
            <Box
                sx={{
                    flex: 1,
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

export default Auth;
