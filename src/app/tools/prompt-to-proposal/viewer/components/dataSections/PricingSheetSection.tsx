"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { DeleteOutline, Add } from "@mui/icons-material";

type PricingSheetProps = {
  data: any;
  onChange: (updated: any) => void;
};

const PricingSheetSection: React.FC<PricingSheetProps> = ({ data, onChange }) => {
  const { pricingSheet } = data;
  if (!pricingSheet) return null;

  const recalculateTotals = (details: any[]) => {
    const totalHours = details.reduce(
      (sum, m) => sum + m.hours * m.count,
      0
    );
    const totalCost = details.reduce(
      (sum, m) => sum + m.cost * m.count,
      0
    );

    onChange({
      ...data,
      pricingSheet: {
        totalHours,
        totalCost,
        details,
      },
    });
  };

  const handleFieldChange =
    (index: number, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updated = [...pricingSheet.details];
      const value =
        field === "role"
          ? e.target.value
          : Math.max(0, Number(e.target.value) || 0);

      updated[index][field] = value;

      // Recalculate cost per role
      updated[index].cost =
        updated[index].hours * updated[index].hourlyRate;

      recalculateTotals(updated);
    };

  const handleDelete = (index: number) => {
    const updated = pricingSheet.details.filter(
      (_: any, i: number) => i !== index
    );
    recalculateTotals(updated);
  };

  const handleAdd = () => {
    const updated = [
      ...pricingSheet.details,
      {
        role: "New Role",
        count: 1,
        hours: 0,
        hourlyRate: 0,
        cost: 0,
      },
    ];
    recalculateTotals(updated);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        Pricing Sheet
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {pricingSheet.details.map((member: any, index: number) => (
          <Card
            key={index}
            variant="outlined"
            sx={{ borderRadius: 2, position: "relative" }}
          >
            <CardContent>
              <Stack spacing={2}>
                {/* Editable Role */}
                <TextField
                  label="Role"
                  value={member.role}
                  onChange={handleFieldChange(index, "role")}
                  fullWidth
                />

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Count"
                    type="number"
                    value={member.count}
                    onChange={handleFieldChange(index, "count")}
                    fullWidth
                  />

                  <TextField
                    label="Hours"
                    type="number"
                    value={member.hours}
                    onChange={handleFieldChange(index, "hours")}
                    fullWidth
                  />

                  <TextField
                    label="Hourly Rate ($)"
                    type="number"
                    value={member.hourlyRate}
                    onChange={handleFieldChange(index, "hourlyRate")}
                    fullWidth
                  />
                </Stack>

                {/* <Typography color="text.secondary">
                  Cost:{" "}
                  <strong>${member.cost.toFixed(2)}</strong>
                </Typography> */}
              </Stack>

              {/* Delete */}
              <IconButton
                color="error"
                size="small"
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => handleDelete(index)}
              >
                <DeleteOutline />
              </IconButton>
            </CardContent>
          </Card>
        ))}

        {/* Add Role */}
        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{ alignSelf: "flex-start" }}
          onClick={handleAdd}
        >
          Add Role
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Totals */}
      <Box sx={{ textAlign: "right" }}>
        <Typography fontWeight={600}>
          Total Hours: {pricingSheet.totalHours}
        </Typography>
        <Typography fontWeight={600}>
          Total Cost: ${pricingSheet.totalCost.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default PricingSheetSection;
