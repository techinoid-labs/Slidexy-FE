"use client";

import React from "react";
import { Box, Typography, TextField, Stack } from "@mui/material";

type ContactSectionProps = {
  data: {
    thankyou: {
      number: string;
      email: string;
      address: string;
    };
  };
  onChange: (updated: any) => void;
};

const ContactSection: React.FC<ContactSectionProps> = ({ data, onChange }) => {
  const contact = data.thankyou;

  if (!contact) return null;

  const handleChange =
    (field: "number" | "email" | "address") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...data,
        thankyou: {
          ...contact,
          [field]: e.target.value,
        },
      });
    };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        Contact Information
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Phone Number"
          value={contact.number}
          onChange={handleChange("number")}
          fullWidth
        />

        <TextField
          label="Email"
          value={contact.email}
          onChange={handleChange("email")}
          fullWidth
        />

        <TextField
          label="Address"
          value={contact.address}
          onChange={handleChange("address")}
          fullWidth
          multiline
          minRows={2}
        />
      </Stack>
    </Box>
  );
};

export default ContactSection;
