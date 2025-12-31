"use client";

import { Box, Typography, TextField, Divider } from "@mui/material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
};

export default function OverviewSection({ data, onChange }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Project Overview</Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
        value={data.overview}
        onChange={(e) => onChange({ ...data, overview: e.target.value })}
      />
      <Divider sx={{ my: 3 }} />
    </Box>
  );
}