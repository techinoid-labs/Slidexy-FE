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

interface AuthModalProps {
  onClose: () => void;
  presentationId: string | null | undefined;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, presentationId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: string, value: string) => {
    let message = "";

    if (name === "email") {
      if (!value.trim()) {
        message = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = "Enter a valid email";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        message = "Password is required";
      } else if (value.length < 8) {
        message = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(value)) {
        message = "Password must include at least one uppercase letter";
      } else if (!/[a-z]/.test(value)) {
        message = "Password must include at least one lowercase letter";
      } else if (!/[0-9]/.test(value)) {
        message = "Password must include at least one number";
      } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
        message = "Password must include at least one special character";
      }
    }

    setFieldErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateForm = () => {
    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);
    return emailValid && passwordValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isSignup) {
        await axios.post(`http://localhost:5000/api/users/register`, {
          email,
          password,
          presentationId: presentationId || null,
        });
      }

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        presentationId: presentationId || null,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
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
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </Typography>

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
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
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
            "Sign Up"
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
            : "Don't have an account? Sign Up"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AuthModal;
