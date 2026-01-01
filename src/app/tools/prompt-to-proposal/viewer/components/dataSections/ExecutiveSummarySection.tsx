"use client";

import { Box, Typography, TextField, Divider } from "@mui/material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
};

export default function ExecutiveSummarySection({ data, onChange }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Executive Summary</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
        value={data.executiveSummary}
        onChange={(e) => onChange({ ...data, executiveSummary: e.target.value })}
      />

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        Project Objectives
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        sx={{ mt: 1 }}
        value={data.projectObjectives.join("\n")}
        onChange={(e) => {
          const updated = e.target.value.split(/\r?\n/);
          onChange({ ...data, projectObjectives: updated });
        }}
        placeholder="Enter one objective per line"
      />

      <Divider sx={{ my: 3 }} />
    </Box>
  );
}
