"use client";

import { Box, TextField, Typography, Divider } from "@mui/material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
};

export default function ProjectApproachSection({ data, onChange }: Props) {
  if (!data.projectApproach || data.projectApproach.length === 0) return null;

  return (
    <>
      <Typography variant="h6">Project Approach</Typography>
      {data.projectApproach.map((phase: any, i: number) => (
        <Box key={i} sx={{ mt: 2 }}>
          <TextField
            label="Phase Title"
            fullWidth
            value={phase.title}
            onChange={(e) => {
              const updated = [...data.projectApproach];
              updated[i].title = e.target.value;
              onChange({ ...data, projectApproach: updated });
            }}
          />
          <TextField
            label="Phase Items (one per line)"
            fullWidth
            multiline
            minRows={4}
            sx={{ mt: 1 }}
            value={phase.items.join("\n")}
            onChange={(e) => {
              const updated = [...data.projectApproach];
              updated[i].items = e.target.value.split(/\r?\n/);
              onChange({ ...data, projectApproach: updated });
            }}
            placeholder="Enter one item per line"
          />
        </Box>
      ))}
      <Divider sx={{ my: 3 }} />
    </>
  );
}
