"use client";

import {
  Box,
  TextField,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
  name: string;
  email: string;
  contact: string;
  message: string;
};

export default function OnboardingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const [onBoarding, setOnBoarding] = useState<FormValues>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const onSubmit = async (data: FormValues) => {
    console.log("Submitted data:", data);
    setOnBoarding(data);
    console.log("OnBoarding Form Details:", data);

    toast.success("Form submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });

    reset(); // reset after submission
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 4,
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          border: "2px solid #8E2DE2",
          backgroundColor: "#fff",
          boxShadow: "4px 5px 0px 0px #8E2DE2",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/images/Logo.svg"
              alt="Slides Logo"
              width={128}
              height={44}
            />
          </Box>
        </Link>

        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 3, textAlign: "center", color: "#4A00E0" }}
        >
          Onboarding Form
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Enter a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Contact Number"
          fullWidth
          margin="normal"
          {...register("contact", {
            required: "Contact number is required",
            pattern: {
              value: /^\d{10,15}$/,
              message: "Enter a valid contact number (10-15 digits)",
            },
          })}
          error={!!errors.contact}
          helperText={errors.contact?.message}
        />

        <TextField
          label="Message"
          fullWidth
          margin="normal"
          multiline
          minRows={4}
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message should be at least 10 characters long",
            },
          })}
          error={!!errors.message}
          helperText={errors.message?.message}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            color: isSubmitting ? "#fff" : "#8E2DE2",
            border: "2px solid #8E2DE2",
            borderRadius: "999px",
            backgroundColor: "#fff",
            position: "relative",
            "&:hover": {
              backgroundColor: "#f3eaff",
            },
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}
