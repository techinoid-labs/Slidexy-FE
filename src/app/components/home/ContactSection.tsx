"use client";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

type ContactFormInputs = {
  name: string;
  email: string;
  message: string;
};

export default function ContactSection() {
  const { handleSubmit, control, reset } = useForm<ContactFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onSubmit = (data: ContactFormInputs) => {
    console.log("Contact Form Data:", data);
    reset();
    setOpenSnackbar(true); // show feedback
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
        backgroundColor: "#ffffff",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: "#111827",
        }}
      >
        Contact Us
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 6,
          color: "text.secondary",
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        Have questions or feedback? We'd love to hear from you. Fill out the
        form below and our team will get back to you shortly.
      </Typography>

      {/* Form Wrapper */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: "700px",
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: "16px",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3 }}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Full Name"
                placeholder="Enter your name"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
            )}
          />

          <Controller
            name="message"
            control={control}
            rules={{ required: "Message is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Your Message"
                placeholder="Type your message here..."
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
            )}
          />

          <Box textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#7C3AED",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "10px",
                px: 5,
                py: 1.4,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#6D28D9",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 4px 12px rgba(124, 58, 237, 0.3)",
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ✅ Thank you! Your message has been sent.
        </Alert>
      </Snackbar>
    </Box>
  );
}
