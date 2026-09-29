"use client";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit contact form");
      }

      reset();
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="section"
      id="contact-section"
      sx={{
        py: { xs: 5, md: 7 },
        px: { xs: 2, md: 6 },
        backgroundColor: "#ffffff",
        textAlign: "center",
      }}
    >
      {/* Form Wrapper */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          maxWidth: { xs: "100%", md: "1120px" },
          height: { xs: "auto", md: "505px" },
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: "16px",
          backgroundColor: "rgba(251, 250, 255, 1)",
          border: "1px solid rgba(232, 228, 255, 1)",
          justifyContent: 'center',
          boxShadow: "none",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 44px -22px rgba(142,45,226,0.25)",
            borderColor: "rgba(142, 45, 226, 0.25)",
          },
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontFamily: "Raleway",
            fontWeight: 500,
            fontSize: "32px",
            lineHeight: "100%",
            letterSpacing: "0px",
            textAlign: "center",
            color: "#111827",
          }}
        >
          Reach Our Customer Service Team
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: -4,
            color: "text.secondary",
            maxWidth: "810px",
            height: "123px",
            mx: "auto",
          }}
        >
          Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3, justifyContent: "center" }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              flexDirection: {
                sm: "row",
              },
            }}
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  placeholder="Enter Your Full Name"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Image src='/images/home/name-icon.svg' width={19.518817901611328} height={18.769651412963867} alt="icon" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: {
                      sm: "100%",
                      md: "360px",
                      lg: "486px",
                    },
                    backgroundColor: "#fff",
                    "& .MuiInputLabel-root": {
                      color: "rgba(176, 176, 176, 1)",
                      fontWeight: 400,
                    },
                    "& .MuiInputBase-input": {
                      paddingTop: "14px",
                      paddingBottom: "14px",
                    },
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Image src='/images/home/email-icon.svg' width={19.5} height={15} alt="icon" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: {
                      sm: "100%",
                      md: "360px",
                      lg: "486px",
                    },
                    backgroundColor: "#fff",
                    "& .MuiInputLabel-root": {
                      color: "rgba(176, 176, 176, 1)",
                      fontWeight: 400,
                    },
                    "& .MuiInputBase-input": {
                      paddingTop: "14px",
                      paddingBottom: "14px",
                    },
                  }}
                />
              )}
            />
          </Box>

          <Controller
            name="message"
            control={control}
            rules={{ required: "Message is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Your Message"
                placeholder="Enter Your Message"
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{
                  width: {
                    sm: "100%",
                    md: "740px",
                    lg: "992px",
                  },
                  backgroundColor: "#fff",
                  "& .MuiInputLabel-root": {
                    color: "rgba(176, 176, 176, 1)",
                    fontWeight: 400,
                  },
                }}
              />
            )}
          />

          <Box textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ width: { sm: "350px", md: "100%", lg: "992px" } }}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Success Snackbar */}
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

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={5000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          ❌ Oops! Something went wrong. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
