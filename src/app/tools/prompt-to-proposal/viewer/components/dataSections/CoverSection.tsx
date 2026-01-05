"use client";
import { Box, Typography, TextField, Divider } from "@mui/material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
};

export default function CoverSection({ data, onChange }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Basic Information</Typography>
      <TextField
        label="Title"
        fullWidth
        sx={{ mt: 2 }}
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
      />
      <Divider sx={{ my: 3 }} />
    </Box>
  );
}
