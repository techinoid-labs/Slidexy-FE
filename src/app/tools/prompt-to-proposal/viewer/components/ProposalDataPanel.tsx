"use client";

import { Box } from "@mui/material";
import CoverSection from "./dataSections/CoverSection";
import AboutSection from "./dataSections/AboutSection";
import OverviewSection from "./dataSections/OverviewSection";
import ExecutiveSummarySection from "./dataSections/ExecutiveSummarySection";
import ScopeSection from "./dataSections/ScopeSection";
import ProjectApproachSection from "./dataSections/ProjectApproachSection";
import KeyFeaturesSection from "./dataSections/KeyFeaturesSection";
import TimelineSection from "./dataSections/TimelineSection";
import PricingSheetSection from "./dataSections/PricingSheetSection"; 
import ContactSection from "./dataSections/ThankyouSection";

type Props = {
  data: any;
  onChange: (updated: any) => void;
  currentSectionId: string | undefined;
};

// Mapping for fixed sections
const SECTION_COMPONENTS: { [key: string]: any } = {
  cover: CoverSection,
  about: AboutSection,
  overview: OverviewSection,
  "executive-summary": ExecutiveSummarySection,
  "key-features": KeyFeaturesSection,
  timeline: TimelineSection,
//   "team-structure": TeamStructureSection,
"pricing-sheet": PricingSheetSection,
"thankyou": ContactSection,
};

export default function ProposalDataPanel({ data, onChange, currentSectionId }: Props) {
  console.log("Current Section ID:", currentSectionId);

  // Handle dynamic sections first
  if (currentSectionId?.startsWith("scope-")) {
    const scopeIndex = parseInt(currentSectionId.split("-")[1]);
    return <ScopeSection data={data} onChange={onChange} scopeIndex={scopeIndex} />;
  }

  if (currentSectionId === "project-approach" || currentSectionId?.startsWith("project-approach-")) {
    console.log("Rendering ProjectApproachSection");
    return <ProjectApproachSection data={data} onChange={onChange} />;
  }

  // Fixed sections
  const SectionComponent = currentSectionId ? SECTION_COMPONENTS[currentSectionId] : null;
  return <Box sx={{ p: 3 }}>{SectionComponent && <SectionComponent data={data} onChange={onChange} />}</Box>;
}
