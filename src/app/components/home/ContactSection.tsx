"use client";

import { useState } from "react";
import { Box, Container, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import { ACCENT, BONE_DEEP, Display, INK, Lede, MONO, MUTED, RULE, SectionHead } from "./editorial";
import Gutter, { CONTACT_GUTTER } from "./Gutter";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ContactFormInputs = {
  name: string;
  email: string;
  message: string;
};

/**
 * Contact.
 *
 * Was a rounded card holding three outlined MUI text fields, which is the
 * default contact form on roughly every site built this decade. The fields
 * here are underlines rather than boxes: fewer borders competing with the
 * ruled layout, and it reads like a form on paper, which suits the rest of
 * the page.
 *
 * The submit logic and endpoint are unchanged.
 */

/** A text field as a single rule, with the label sitting above it. */
function RuledField({
  label,
  placeholder,
  value,
  onChange,
  error,
  multiline = false,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  multiline?: boolean;
  type?: string;
}) {
  const shared = {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontFamily: "inherit",
    fontSize: "1rem",
    color: INK,
    padding: "10px 0",
    resize: "none" as const,
    "&::placeholder": { color: "#B4AEC0" },
  };

  return (
    <Box sx={{ mb: 3.5 }}>
      <Typography
        component="label"
        sx={{
          display: "block",
          fontFamily: MONO,
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: error ? "#C0392B" : MUTED,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          borderBottom: `1.5px solid ${error ? "#C0392B" : RULE}`,
          transition: "border-color 0.15s ease",
          "&:focus-within": { borderColor: INK },
        }}
      >
        {multiline ? (
          <Box
            component="textarea"
            rows={4}
            value={value}
            placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            sx={shared}
          />
        ) : (
          <Box
            component="input"
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            sx={shared}
          />
        )}
      </Box>
      {error && (
        <Typography sx={{ mt: 0.75, fontSize: "0.8rem", color: "#C0392B" }}>{error}</Typography>
      )}
    </Box>
  );
}


export default function ContactSection() {
  const { handleSubmit, control, reset } = useForm<ContactFormInputs>({
    defaultValues: { name: "", email: "", message: "" },
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit contact form");
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
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: BONE_DEEP,
        py: { xs: 8, md: 14 },
      }}
    >
      <Gutter items={CONTACT_GUTTER} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <SectionHead index="06" label="Talk to us" />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: { xs: 5, md: 10 },
            alignItems: "start",
          }}
        >
          <Box>
            <Display sx={{ fontSize: { xs: "1.9rem", md: "2.7rem" }, mb: 2.5 }}>
              Tell us what is
              <br />
              getting in the way.
            </Display>
            <Lede sx={{ mb: 4 }}>
              Something broken, or a template that does not exist yet.
              Both are useful to us.
            </Lede>

            <Box sx={{ borderTop: `1px solid ${RULE}`, pt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, color: MUTED }}>
                <MailOutlineRounded sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: "0.92rem" }}>
                  Every message reaches a person, not a queue.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tell us who you are" }}
              render={({ field, fieldState }) => (
                <RuledField
                  label="Your name"
                  placeholder="Jordan Avery"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: "We need somewhere to reply",
                pattern: { value: /\S+@\S+\.\S+/, message: "That address looks off" },
              }}
              render={({ field, fieldState }) => (
                <RuledField
                  label="Email"
                  type="email"
                  placeholder="jordan@studio.com"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="message"
              control={control}
              rules={{ required: "A sentence is enough" }}
              render={({ field, fieldState }) => (
                <RuledField
                  label="Message"
                  multiline
                  placeholder="What are you trying to do?"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Box
              component="button"
              type="submit"
              disabled={loading}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                mt: 1,
                px: 3,
                py: 1.5,
                border: "none",
                bgcolor: INK,
                color: "#fff",
                fontFamily: "inherit",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "background 0.15s ease",
                "&:hover": { bgcolor: loading ? INK : ACCENT },
              }}
            >
              {loading ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : null}
              {loading ? "Sending" : "Send it"}
              {!loading && <ArrowForwardRounded sx={{ fontSize: 15 }} />}
            </Box>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: 0 }} onClose={() => setOpenSnackbar(false)}>
          Got it. We will come back to you.
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={5000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ borderRadius: 0 }} onClose={() => setErrorSnackbar(false)}>
          That did not send. Try again in a moment.
        </Alert>
      </Snackbar>
    </Box>
  );
}
