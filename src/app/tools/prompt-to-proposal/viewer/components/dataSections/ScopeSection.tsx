"use client";

import { Box, TextField } from "@mui/material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
  scopeIndex: number;
};

export default function ScopeSection({ data, onChange, scopeIndex }: Props) {
  const section = data.scopeOfWork[scopeIndex];

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        label="Section Title"
        fullWidth
        value={section.title}
        onChange={(e) => {
          const updated = [...data.scopeOfWork];
          updated[scopeIndex].title = e.target.value;
          onChange({ ...data, scopeOfWork: updated });
        }}
      />

      <TextField
        label="Section Points (one per line)"
        fullWidth
        multiline
        minRows={4}
        sx={{ mt: 2 }}
        value={section.items.join("\n")}
        onChange={(e) => {
          const updated = [...data.scopeOfWork];
          updated[scopeIndex].items = e.target.value.split(/\r?\n/);
          onChange({ ...data, scopeOfWork: updated });
        }}
      />
    </Box>
  );
}