'use client';

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import axios from "axios";
import { Box, Paper } from '@mui/material';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import ResetPasswordForm from './components/ResetPasswordForm';

interface AuthProps {
    presentationId?: string | null;
}

type FormData = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
    remember?: boolean;
    token?: string;
    newPassword?: string;
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
type ActiveForm = 'signup' | 'login' | 'forgot' | 'reset';

const Auth: React.FC<AuthProps> = (
    { presentationId }
) => {
    // Shared form state
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false,
        remember: false,
    });

    const fpPromise = FingerprintJS.load();

    async function getFingerprint() {
        const fp = await fpPromise;
        const result = await fp.get();
        return result.visitorId;
    }

    // Track which form is active
    const [activeForm, setActiveForm] = useState<ActiveForm>('login');

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (activeForm === "signup") {
                // Sign up user via your API
                const fingerprint = await getFingerprint();
                await axios.post(`${API_BASE_URL}/api/users/register`, {
                    email: formData.email,
                    password: formData.password,
                    presentationId: presentationId || null,
                    fingerprint,
                });

                // After signup → auto login
                const res = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });

                if (res?.error) {
                    alert(res.error); // handle error properly
                } else {
                    window.location.href = "/"; // redirect after login
                }
            } else if (activeForm === "login") {
                // Login user
                const res = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });

                if (res?.error) {
                    alert(res.error); // handle error properly
                } else {
                    window.location.href = "/"; // redirect after login
                }
            } else if (activeForm === "forgot") {
                // Implement forgot password logic via API
                await axios.post(`${API_BASE_URL}/api/users/request-password-reset`, {
                    email: formData.email,
                });
                alert("Password reset link sent to your email.");
                setActiveForm("reset");
            } else if (activeForm === "reset") {
                await axios.post(`${API_BASE_URL}/api/users/reset-password`, {
                    token: formData.token,
                    newPassword: formData.newPassword,
                });
                alert("Password Updated Successfully.");
                setActiveForm("login");
            }
        } catch (err: any) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    const validateField = (name: string, value: string) => {
        let message = "";
        if (name === "email") {
            if (!value) message = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                message = "Enter a valid email";
        }
        if (name === "password") {
            if (!value) message = "Password is required";
            else if (value.length < 8) message = "Password must be at least 8 chars";
        }
        return message;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: { xs: 'column', md: 'row' },
            }}
        >
            {/* Left Panel - Forms */}
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
                {activeForm === 'signup' && (
                    <SignupForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        switchForm={setActiveForm}
                    />
                )}

                {activeForm === 'login' && (
                    <LoginForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        switchForm={setActiveForm}
                    />
                )}

                {activeForm === 'forgot' && (
                    <ForgotPasswordForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        switchForm={setActiveForm}
                    />
                )}
                {activeForm === 'reset' && (
                    <ResetPasswordForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        switchForm={setActiveForm}
                    />
                )}

            </Paper>

            {/* Right Panel - Logo/Image */}
            <Box
                sx={{
                    flex: 1,
                    backgroundColor: '#F0EBFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
