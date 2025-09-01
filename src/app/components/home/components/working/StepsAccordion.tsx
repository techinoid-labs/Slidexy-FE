import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function StepsAccordion() {
  const [expanded, setExpanded] = useState<string | false>("step1");

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const renderExpandIcon = (step: string) => {
    const isActive = expanded === step;

    return (
      <ExpandMoreIcon
        sx={{
          fontSize: 28,
          color: isActive ? "#6C2BD7" : "#18181B",
          transition: "transform 0.3s ease",
          transform: isActive ? "rotate(0deg)" : "rotate(0deg)",
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        justifyContent: "center",
        width: "100%",
      }}
    >
      {/* Step 1 */}
      <Accordion
        expanded={expanded === "step1"}
        onChange={handleChange("step1")}
        sx={{
          background: expanded === "step1" ? "#F9F9FB" : "#F8F8FF",
          borderRadius: "28px !important",
          boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
          "&:before": { display: "none" },
          p: 1,
        }}
      >
        <AccordionSummary expandIcon={renderExpandIcon("step1")}>
          <Typography
            sx={{
              fontWeight: expanded === "step1" ? 600 : 500,
              fontSize: "1.13rem",
              color: expanded === "step1" ? "#6C2BD7" : "#18181B",
            }}
          >
            Drop In Your Idea{" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: "#757575", fontSize: "1.05rem" }}>
            Just share a thought—type it, record your voice, or paste a link.
            Slidexy instantly understands your input and turns it into a
            presentation starting point.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Step 2 */}
      <Accordion
        expanded={expanded === "step2"}
        onChange={handleChange("step2")}
        sx={{
          background: expanded === "step2" ? "#F9F9FB" : "#F8F8FF",
          borderRadius: "28px !important",
          boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
          "&:before": { display: "none" },
          p: 1,
        }}
      >
        <AccordionSummary expandIcon={renderExpandIcon("step2")}>
          <Typography
            sx={{
              fontWeight: expanded === "step2" ? 600 : 500,
              fontSize: "1.13rem",
              color: expanded === "step2" ? "#6C2BD7" : "#18181B",
            }}
          >
            AI Builds the Story & Design{" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: "#757575", fontSize: "1.05rem" }}>
            Our AI weaves your idea into a clear storyline and designs polished
            slides—no formatting, no wasted hours, just a ready-to-use deck.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Step 3 */}
      <Accordion
        expanded={expanded === "step3"}
        onChange={handleChange("step3")}
        sx={{
          background: expanded === "step3" ? "#F9F9FB" : "#F8F8FF",
          borderRadius: "28px !important",
          boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
          "&:before": { display: "none" },
          p: 1,
        }}
      >
        <AccordionSummary expandIcon={renderExpandIcon("step3")}>
          <Typography
            sx={{
              fontWeight: expanded === "step3" ? 600 : 500,
              fontSize: "1.13rem",
              color: expanded === "step3" ? "#6C2BD7" : "#18181B",
            }}
          >
            Customize, Export & Share{" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: "#757575", fontSize: "1.05rem" }}>
            {" "}
            Make quick edits, add your brand touch, and share your presentation
            in minutes. Simple, seamless, and professional.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
