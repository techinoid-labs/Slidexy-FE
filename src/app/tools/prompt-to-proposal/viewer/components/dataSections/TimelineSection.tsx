"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import { DeleteOutline, Add } from "@mui/icons-material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
};

export default function TimelineSection({ data, onChange }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        Timeline
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {data.timeline.map((t: any, i: number) => (
          <Card
            key={i}
            variant="outlined"
            sx={{
              borderRadius: 2,
              position: "relative",
            }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                {/* Header row */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Week"
                    sx={{ width: 100 }}
                    value={t.week}
                    onChange={(e) => {
                      const updated = [...data.timeline];
                      updated[i].week = e.target.value;
                      onChange({ ...data, timeline: updated });
                    }}
                  />

                  <Chip
                    label={`Step ${i + 1}`}
                    size="small"
                    sx={{ ml: "auto" }}
                  />
                </Stack>

                <TextField
                  label="Title"
                  fullWidth
                  value={t.title}
                  onChange={(e) => {
                    const updated = [...data.timeline];
                    updated[i].title = e.target.value;
                    onChange({ ...data, timeline: updated });
                  }}
                />

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  minRows={3}
                  value={t.description}
                  onChange={(e) => {
                    const updated = [...data.timeline];
                    updated[i].description = e.target.value;
                    onChange({ ...data, timeline: updated });
                  }}
                />

                <TextField
                  label="Duration"
                  fullWidth
                  placeholder="e.g. 1 week"
                  value={t.duration}
                  onChange={(e) => {
                    const updated = [...data.timeline];
                    updated[i].duration = e.target.value;
                    onChange({ ...data, timeline: updated });
                  }}
                />
              </Stack>

              <IconButton
                size="small"
                color="error"
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => {
                  const updated = data.timeline.filter(
                    (_: any, idx: number) => idx !== i
                  );
                  onChange({ ...data, timeline: updated });
                }}
              >
                <DeleteOutline />
              </IconButton>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{ alignSelf: "flex-start" }}
          onClick={() => {
            const updated = [
              ...data.timeline,
              {
                week: `Week ${data.timeline.length + 1}`,
                title: "",
                description: "",
                duration: "",
              },
            ];
            onChange({ ...data, timeline: updated });
          }}
        >
          Add Timeline Step
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
}
