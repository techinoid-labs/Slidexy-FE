"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

interface AuthModalProps {
  onClose: any;
  open: any;
  presentationId?: string | null | undefined;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, presentationId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");
const [newPassword, setNewPassword] = useState(""); 
const [isResetting, setIsResetting] = useState(false); 


  const validateField = (name: string, value: string) => {
    let message = "";
    if (name === "email") {
      if (!value.trim()) message = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Enter a valid email";
    }
    if (name === "password") {
      if (!value.trim()) message = "Password is required";
      else if (value.length < 8) message = "Password must be at least 8 characters";
    }
    setFieldErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateForm = () => {
    const emailValid = validateField("email", email);
    if (isForgotMode) return emailValid; // only email required in forgot mode
    const passwordValid = validateField("password", password);
    return emailValid && passwordValid;
  };

  const fpPromise = FingerprintJS.load();
  async function getFingerprint() {
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
  }

const handleSubmit = async () => {
  if (!validateForm()) return;
  setLoading(true);
  setError("");
  setResetSuccess(false);

  try {
    if (isForgotMode && !isResetting) {
      // 1️⃣ Request reset link
      const res = await axios.post(`${API_BASE_URL}/api/users/request-password-reset`, { email });
      setResetSuccess(true);
      setIsResetting(true); // now show password input
      return;
    }

    if (isForgotMode && isResetting) {
      // 2️⃣ Reset password using token
      if (!newPassword || newPassword.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }

      await axios.post(`${API_BASE_URL}/api/users/reset-password`, {
        token: resetToken,
        newPassword,
      });

      setAuthSuccess(true);
      setIsForgotMode(false);
      setIsResetting(false);
      setResetSuccess(false);
      setNewPassword("");
      return;
    }

    // Normal signup/login flow
    let res;
    if (isSignup) {
      const fingerprint = await getFingerprint();
      await axios.post(`${API_BASE_URL}/api/users/register`, {
        email,
        password,
        presentationId: presentationId || null,
        fingerprint,
      });
    }

    res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      presentationId: presentationId || null,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setAuthSuccess(true);
    }
  } catch (err: any) {
    const msg = err.response?.data?.message || "Something went wrong";
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  return (
   <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: { xs: 300, md: 400 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {authSuccess ? (
          <>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              🎉 {isSignup ? "Account created!" : "Password Updated / Welcome Back!"}
            </Typography>
            <Typography variant="body2" textAlign="center" color="text.secondary">
              You can now login and start creating presentations.
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onClose}>
              Continue
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              {isForgotMode
                ? isResetting
                  ? "Reset Your Password"
                  : "Forgot Password?"
                : isSignup
                ? "Start Your Free 3-Day Trial"
                : "Welcome Back"}
            </Typography>

            {isForgotMode ? (
              <>
                {!isResetting && (
                  <>
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                      Enter your registered email to receive a reset link.
                    </Typography>
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      required
                    />
                    {resetSuccess && (
                      <Typography color="success.main" textAlign="center" sx={{ mt: 1 }}>
                        Reset link sent! Check your inbox.
                      </Typography>
                    )}
                  </>
                )}

                {isResetting && (
                  <>
                    <TextField
                      label="Reset Token"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      fullWidth
                      required
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      fullWidth
                      required
                      sx={{ mt: 1 }}
                    />
                  </>
                )}

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isResetting ? (
                    "Reset Password"
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Button
                  variant="text"
                  onClick={() => {
                    setIsForgotMode(false);
                    setIsResetting(false);
                    setResetToken("");
                  }}
                  fullWidth
                >
                  Back to Sign In
                </Button>
              </>
            ) : (
              <>
                {/* Normal Signin / Signup Mode */}
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField("email", e.target.value);
                  }}
                  error={Boolean(fieldErrors.email)}
                  helperText={fieldErrors.email}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                  }}
                  error={Boolean(fieldErrors.password)}
                  helperText={fieldErrors.password}
                  fullWidth
                  required
                  InputProps={{
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

                {error && (
                  <Box sx={{ textAlign: "center" }}>
                    {!isSignup && (
                      <Button
                        variant="text"
                        sx={{
                          textTransform: "none",
                          fontSize: "0.85rem",
                          color: "primary.main",
                        }}
                        onClick={() => setIsForgotMode(true)}
                      >
                        Forgot Password?
                      </Button>
                    )}
                  </Box>
                )}

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isSignup ? (
                    "Start Free Trial"
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Button
                  variant="text"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError("");
                    setFieldErrors({});
                  }}
                  fullWidth
                >
                  {isSignup
                    ? "Already have an account? Sign In"
                    : "Don’t have an account? Start Free Trial"}
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AuthModal;
